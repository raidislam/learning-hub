import { bridgeMain, workerMain } from "./sandboxScripts";

export interface LogEntry {
  level: "log" | "warn" | "error";
  text: string;
}

export interface RunResult {
  logs: LogEntry[];
  error: { name: string; message: string } | null;
  timedOut: boolean;
  durationMs: number;
}

export interface RunOptions {
  timeoutMs?: number;
}

const MAX_LOGS = 1000;
const MAX_CHARS = 200_000;

/**
 * Isolation model:
 *  - A hidden <iframe sandbox="allow-scripts"> (NO allow-same-origin) => opaque origin:
 *    no access to the app's DOM, cookies, localStorage or IndexedDB.
 *  - Inside it, user code runs in a dedicated Web Worker (no DOM at all).
 *  - A CSP meta tag restricts what the sandbox may load/connect to.
 *  - On timeout the iframe is removed, which terminates the worker (infinite loops can't freeze the app).
 * The user's code is never evaluated in the app's own JS context.
 */
const CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline' 'unsafe-eval' blob:",
  "worker-src blob:",
  "connect-src https: http:",
].join("; ");

const WORKER_SRC = `(${workerMain.toString()})()`;
const SRC_DOC = `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="${CSP}"></head><body><script>(${bridgeMain.toString()})()<\/script></body></html>`;

export function runCode(code: string, { timeoutMs = 5000 }: RunOptions = {}): Promise<RunResult> {
  return new Promise((resolve) => {
    const started = performance.now();
    const token = crypto.randomUUID();
    const logs: LogEntry[] = [];
    let chars = 0;
    let error: RunResult["error"] = null;
    let settled = false;

    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
    iframe.srcdoc = SRC_DOC;

    const finish = (timedOut: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      iframe.remove(); // terminates the worker
      resolve({ logs, error, timedOut, durationMs: Math.round(performance.now() - started) });
    };

    const timer = setTimeout(() => {
      error ??= {
        name: "TimeoutError",
        message: `কোড ${timeoutMs / 1000} সেকেন্ডের মধ্যে শেষ হয়নি। সম্ভবত অসীম loop, clear না করা setInterval, বা কখনো resolve না হওয়া Promise।`,
      };
      finish(true);
    }, timeoutMs);

    function onMessage(e: MessageEvent) {
      if (e.source !== iframe.contentWindow) return;
      const data = e.data as { ready?: boolean; token?: string; msg?: Record<string, string> } | null;
      if (!data) return;
      if (data.ready) {
        iframe.contentWindow?.postMessage({ type: "run", token, code, workerSrc: WORKER_SRC }, "*");
        return;
      }
      if (data.token !== token || !data.msg) return;
      const m = data.msg;
      if (m.t === "log") {
        if (logs.length >= MAX_LOGS || chars > MAX_CHARS) {
          if (logs.length === MAX_LOGS) logs.push({ level: "warn", text: "… output সীমা ছাড়িয়েছে, বাকি অংশ বাদ দেওয়া হলো" });
          return;
        }
        chars += m.text.length;
        logs.push({ level: m.level as LogEntry["level"], text: m.text });
      } else if (m.t === "error") {
        error ??= { name: m.name, message: m.message };
      } else if (m.t === "done") {
        finish(false);
      }
    }

    window.addEventListener("message", onMessage);
    document.body.appendChild(iframe);
  });
}

/** Only stdout-like lines (console.log/info/debug) are compared, like a real terminal's stdout. */
export function stdoutOf(result: RunResult): string {
  return result.logs
    .filter((l) => l.level === "log")
    .map((l) => l.text)
    .join("\n");
}

const norm = (s: string) =>
  s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

export function outputsMatch(expected: string, actual: string): boolean {
  return norm(expected) === norm(actual);
}
