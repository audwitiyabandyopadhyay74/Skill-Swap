"use client";
import React from "react";
import { useRouter } from "next/navigation";
import LightPillar from "./backgrounds/LightPillar";
import StrokeText from "./texts/StrokeText";
// import DriftWall from "./DriftWall";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const MasterTheSkillOfHelping = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ss_token");
      if (token) {
        router.push("/dashboard");
      } else {
        router.push("/auth/signup");
      }
    }
  };

  return (
    <div className="w-full h-screen relative items-center justify-center overflow-hidden">
      {/* Background layer with low z-index */}
      <div className="absolute inset-0 z-[0]">
        <LightPillar
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>

      {/* Foreground section unchanged, just corrected z-index */}
      <div className="w-full h-screen flex flex-col items-center justify-center gap-34">
        <StrokeText
          text="Mastering The Skill                  
  Of Helping"
          strokeColor="#A78BFA"
          fillColor="#F8FAFC"
          strokeWidth={1.4}
          drawDuration={1.6}
          fillDelay={0.2}
          stagger={0.05}
          ease="power2.out"
          trigger="scroll"
          fillMode="wipe"
          fontSize={128}
          fontWeight={800}
          letterSpacing={-4}
          reverse={true}
          className="relative"
        />
        <button
          onClick={handleGetStarted}
          className="rounded-full w-70 h-20 box-content shadow-2xl text-white -mt-50 z-[100] bg-green-600 animate-bounce cursor-pointer hover:w-80 hover:animate-none font-bold text-xl flex items-center justify-center active:scale-95 transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default MasterTheSkillOfHelping;

