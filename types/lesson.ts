/**
 * Lesson content schema. Content files in /content export a `Lesson`;
 * UI components in /components/lessons render it. Everything here must be
 * serializable (no functions) so server components can pass it to client islands.
 */

/** Inline markup supported in text: **bold**, `code`. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; code: string; caption?: string }
  | { type: "callout"; tone: "info" | "warn" | "danger" | "tip"; title?: string; text: string }
  | { type: "compare"; headers: string[]; rows: string[][] };

export interface MemoryCell {
  name: string;
  value: string;
  kind: "var" | "let" | "const" | "value";
  /** live = initialised, tdz = declared but unusable, undefined = hoisted var */
  state: "live" | "tdz" | "hoisted" | "error";
}

export interface MemoryStep {
  /** 0-based index into `code` lines, or -1 for none */
  line: number;
  memory: MemoryCell[];
  note: string; // Bangla explanation of this step
  /** optional console output produced by this step */
  output?: string;
}

export interface FlowNode {
  id: string;
  label: string;
  sub?: string;
}

export interface FlowStep {
  /** node ids highlighted in this step */
  active: string[];
  /** text lines currently "inside" a node (e.g. call stack frames, queue items) */
  items?: Record<string, string[]>;
  note: string; // Bangla
  output?: string;
}

export type VisualSpec =
  | {
      kind: "memory-steps";
      title: string;
      caption?: string;
      code: string;
      steps: MemoryStep[];
    }
  | {
      /**
       * Generic "boxes and arrows" step diagram: pipelines (source -> parser -> bytecode),
       * stacks/queues (items listed inside nodes), architectures. Nodes are laid out in order.
       */
      kind: "flow-steps";
      title: string;
      caption?: string;
      nodes: FlowNode[];
      steps: FlowStep[];
    };

export interface CodeExample {
  level: "beginner" | "intermediate" | "real-world";
  title: string;
  description: string;
  code: string;
}

export interface DebugCase {
  title: string;
  bad: string;
  why: string;
  fix: string;
}

export interface Exercise {
  level: "beginner" | "intermediate" | "challenge";
  title: string;
  prompt: string;
  starter: string;
  /** exact console output expected (trimmed, line by line) */
  expected: string;
  hints: string[];
  solution: string;
  explanation?: string;
}

export interface Mcq {
  question: string;
  options: string[];
  answer: number; // index
  explanation: string; // why correct + why others wrong
}

export interface CodingQuestion {
  title: string;
  prompt: string;
  starter: string;
  expected: string;
  solution: string;
}

export interface InterviewQA {
  q: string;
  a: string; // supports inline markup; paragraphs separated by \n\n
}

export interface Lesson {
  objectives: string[];
  /** Section 1 */
  concept: Block[];
  /** Section 2 */
  analogy: Block[];
  /** Section 3 */
  visuals: VisualSpec[];
  /** Section 4 */
  examples: CodeExample[];
  /** Section 5: sample snippets for the playground selector */
  playground: { label: string; code: string }[];
  /** Section 6 */
  debugging: DebugCase[];
  /** Section 7: 3 beginner, 2 intermediate, 1 challenge */
  practice: Exercise[];
  /** Section 8: 5 MCQ + 2 coding */
  assessment: { mcqs: Mcq[]; coding: CodingQuestion[] };
  /** Section 9 */
  interview: InterviewQA[];
  /** Section 10 */
  summary: {
    takeaways: string[];
    syntax: string;
    whenToUse: string[];
    next: string[];
  };
  /** Node.js / browser compatibility note (Bangla) */
  compatibility?: string;
}
