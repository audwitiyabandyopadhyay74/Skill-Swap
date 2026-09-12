"use client";
import React from "react";
import DarkVeil from "./backgrounds/DarkVeil";
import FoldText from "./texts/FoldText";
import DriftWall from "./DriftWall";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const Banner = () => {
  const items = [
    { image: "https://res.cloudinary.com/dnr6j10en/image/upload/v1788590152/IMG-20260905-WA0005_mixy6w.jpg", title: "Peaks", href: "https://example.com/one" },
    { image: "https://res.cloudinary.com/dnr6j10en/image/upload/v1788590153/IMG-20260905-WA0003_h7acua.jpg", title: "Pup", href: "https://example.com/two" },
    { image: "https://res.cloudinary.com/dnr6j10en/image/upload/v1788590153/IMG-20260905-WA0004_msrgoa.jpg", title: "Falls", href: "https://example.com/three" },
    
  ];

  return (
    <div className="w-full h-screen relative items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-[0]">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>

      <div className="w-full h-screen flex items-end justify-center p-12 z-[10]">

        <FoldText
          text={`Learn By
Helping Others`}
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
          className="w-[70%]"
        />
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
        />
      </div>
    </div>
  );
};

export default Banner;
