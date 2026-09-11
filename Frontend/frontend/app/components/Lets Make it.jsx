"use client";
import React from "react";
import { useRouter } from "next/navigation";
import GradientBlinds from "./backgrounds/GradientBlinds";
import FoldText from "./texts/FoldText";
import DriftWall from "./DriftWall";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const LetsMakeit = () => {
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
        <GradientBlinds
    gradientColors={['#FF9FFC', '#5227FF']}
    angle={20}
    noise={0.5}
    blindCount={16}
    blindMinWidth={60}
    spotlightRadius={0.5}
    spotlightSoftness={1}
    spotlightOpacity={1}
    mouseDampening={0.15}
    distortAmount={0}
    shineDirection="left"
    mixBlendMode="lighten"
    color1="#FF9FFC"
    color2="#5227FF"
        />
      </div>

      {/* Foreground section unchanged, just corrected z-index */}
      <div className="w-full h-screen flex-col flex items-center justify-center p-12 z-[10] gap-14">

        <FoldText
          text="So, What Are You Waiting For?"
          splitBy="char"
          hinge="top"
          trigger="scroll"
          duration={0.6}
          stagger={0.045}
          ease="power3.out"
          perspective={700}
          creaseShading={0.55}
          fontSize={80}
          fontWeight={800}
          color="#fff"
        />
        <button 
          onClick={handleGetStarted}
          className="rounded-full w-70 h-20 box-content shadow-2xl text-white mt-10 z-[100] bg-green-600 cursor-pointer hover:scale-105 hover:shadow-green-500/50 font-bold text-xl flex items-center justify-center active:scale-95 transition-all duration-300"
        >
          Get Started
        </button>

       
      </div>
    </div>
  );
};

export default LetsMakeit;
