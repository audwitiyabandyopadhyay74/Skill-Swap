import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/ToastContext";
import PageTransition from "./components/PageTransition";

export const metadata: Metadata = {
  title: "SkillSwap — Peer Skill Exchange Platform",
  description: "Swap skills, learn together, connect live with high-quality WebRTC video calls.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full antialiased selection:bg-[#00ff62] selection:text-black">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white overflow-x-hidden font-sans">
        <ToastProvider>
          <PageTransition>{children}</PageTransition>
        </ToastProvider>
      </body>
    </html>
  );
}
