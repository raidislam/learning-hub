import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressHydrator } from "@/components/progress/ProgressHydrator";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bangla = Noto_Sans_Bengali({ variable: "--font-bangla", subsets: ["bengali", "latin"] });

export const metadata: Metadata = {
  title: { default: "JS Learning Hub", template: "%s · JS Learning Hub" },
  description: "বাংলায় interactive JavaScript শেখার প্ল্যাটফর্ম — Core JS থেকে Full-Stack পর্যন্ত।",
};

// Runs before first paint so the saved theme never flashes (see Next.js "preventing flash before hydration").
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bangla.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <ProgressHydrator />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
