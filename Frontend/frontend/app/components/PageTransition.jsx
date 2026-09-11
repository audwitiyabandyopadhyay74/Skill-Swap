"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * PageTransition
 * – A full-screen curtain (clip-path) sweeps up on every route change, then
 *   the page content fades + slides up beneath it.
 * Drop this once in layout.tsx to cover every page automatically.
 */
export default function PageTransition({ children }) {
  const curtainRef = useRef(null);
  const contentRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const curtain = curtainRef.current;
    const content = contentRef.current;
    if (!curtain || !content) return;

    // Kill any running tweens so rapid navigation doesn't stack
    gsap.killTweensOf([curtain, content]);

    // 1. Instantaneously reset curtain to cover the screen
    gsap.set(curtain, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, display: "block" });
    // 2. Reset content to hidden
    gsap.set(content, { opacity: 0, y: 28 });

    const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });

    // Curtain sweeps up, revealing the page beneath
    tl.to(curtain, {
      clipPath: "inset(100% 0% 0% 0%)",
      duration: 0.75,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(curtain, { display: "none" });
      },
    })
    // Content rises up while curtain is still clearing (overlap)
    .to(
      content,
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
      },
      "-=0.35"
    );

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      {/* Curtain overlay — sits above everything */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "linear-gradient(135deg, #0a0a0a 0%, #0d0d1a 50%, #0a0a0a 100%)",
          pointerEvents: "none",
          display: "block",
          // Thin accent line at the bottom edge of the curtain
          borderBottom: "2px solid rgba(0,255,98,0.5)",
          boxShadow: "0 4px 40px rgba(0,255,98,0.25)",
        }}
      />

      {/* Page content */}
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  );
}
