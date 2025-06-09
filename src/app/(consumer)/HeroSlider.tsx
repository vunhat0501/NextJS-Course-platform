"use client";
import React, { useEffect, useState } from "react";

const heroImages = [
  "/hero1.png",
  "/hero2.png",
  "/hero3.png",
  // Thêm tên file ảnh bạn muốn vào đây
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <img
      src={heroImages[index]}
      alt="Hero"
      className="w-full md:w-1/2 mt-6 md:mt-0 rounded-2xl shadow-xl transition-all duration-700"
      style={{ minHeight: 320, objectFit: "cover" }}
    />
  );
} 