"use client";
import React from "react";
import LightPillar from "./backgrounds/LightPillar";
import StrokeText from "./texts/StrokeText";
// import DriftWall from "./DriftWall";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const MasterTheSkillOfHelping = () => {
  const items = [
    { image: "https://res.cloudinary.com/dnr6j10en/image/upload/v1788590152/IMG-20260905-WA0005_mixy6w.jpg", title: "Peaks", href: "https://example.com/one" },
    { image: "https://res.cloudinary.com/dnr6j10en/image/upload/v1788590153/IMG-20260905-WA0003_h7acua.jpg", title: "Pup", href: "https://example.com/two" },
    { image: "https://res.cloudinary.com/dnr6j10en/image/upload/v1788590153/IMG-20260905-WA0004_msrgoa.jpg", title: "Falls", href: "https://example.com/three" },
    // … keep or repeat items as needed
  ];

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
      {/* <div className="w-full h-screen flex items-end justify-center p-12 z-[10]"> */}
        
<div className="w-full h-screen flex flex-col  items-center justify-center gap-34">


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
<button className="rounded-full w-70 h-20  box-content shadow-2xl text-white -mt-50 z-100 bg-green-600 animate-bounce cursor-pointer hover:w-80 hover:animate-none">Get Started</button>
  </div>
{/*
        <DriftWall
          items={items}
          columns={3}
          tileWidth={250}
          tileHeight={132}
          gap={18}
          tilt={16}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={120}
          direction="up"
          variance={0.45}
          parallax={0.6}
          lift={64}
          fade={0.6}
          dim={0.55}
          overlayColor="#060010"
          radius={14}
          roll={0}
          pauseOnHover={false}
          grayscale={false}
        /> */}
      {/* </div> */}
    </div>
  );
};

export default MasterTheSkillOfHelping;
