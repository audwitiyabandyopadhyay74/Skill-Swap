"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }) {
  const curtainRef = useRef(null);
  const contentRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const curtain = curtainRef.current;
    const content = contentRef.current;
    if (!curtain || !content) return;

    gsap.killTweensOf([curtain, content]);
    gsap.set(curtain, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, display: "block" });
    gsap.set(content, { opacity: 0, y: 28 });

    const tl = gsap.timeline();

    tl.to(curtain, {
      clipPath: "inset(100% 0% 0% 0%)",
      duration: 0.75,
      ease: "expo.inOut",
      onComplete: () => gsap.set(curtain, { display: "none" }),
    }).to(
      content,
      { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
      "-=0.35"
    );

    return () => tl.kill();
  }, [pathname]);

  return (
    <>
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
          borderBottom: "2px solid rgba(0,255,98,0.5)",
          boxShadow: "0 4px 40px rgba(0,255,98,0.25)",
        }}
      />
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  );
}
