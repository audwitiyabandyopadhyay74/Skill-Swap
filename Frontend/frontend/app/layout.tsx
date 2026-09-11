import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/ToastContext";
import PageTransition from "./components/PageTransition";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SkillSwap — Peer Skill Exchange Platform",
  description: "Swap skills, learn together, connect live with high-quality WebRTC video calls.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${jetbrainsMono.variable} dark h-full antialiased selection:bg-[#00ff62] selection:text-black`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white overflow-x-hidden font-sans">
        <ToastProvider>
          <PageTransition>{children}</PageTransition>
        </ToastProvider>
      </body>
    </html>
  );
}

