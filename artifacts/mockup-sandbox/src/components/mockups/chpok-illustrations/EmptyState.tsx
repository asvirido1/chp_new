import React from "react";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      <div 
        className="relative overflow-hidden shadow-2xl rounded-[40px] border-[8px] border-[#0D0D0D] w-[390px] h-[844px]"
        style={{ backgroundColor: "#F5D0C5" }}
      >
        {/* Top Nav */}
        <div className="flex items-center justify-between px-6 pt-12 pb-4">
          <button className="w-12 h-12 flex items-center justify-center rounded-full border-[3px] border-[#0D0D0D] bg-white hover:bg-[#FFD93D] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-['Space_Grotesk',sans-serif] font-black text-xl tracking-wider uppercase text-[#0D0D0D]">
            Мои жалобы
          </h1>
          <button className="w-12 h-12 flex items-center justify-center rounded-full border-[3px] border-[#0D0D0D] bg-[#B4FF00] hover:bg-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>

        {/* Center Illustration */}
        <div className="relative w-full h-[460px] flex items-center justify-center mt-4">
          <svg viewBox="0 0 390 460" className="w-full h-full absolute inset-0">
            {/* Background blob/circle */}
            <circle cx="195" cy="250" r="160" fill="white" stroke="#0D0D0D" strokeWidth="4" />
            
            {/* Cityscape background outlines */}
            <g stroke="#0D0D0D" strokeWidth="3" fill="none" strokeLinejoin="round">
              <path d="M60 250 V140 H100 V180 H140 V120 H190 V200 H230 V150 H280 V250" opacity="0.4" />
              <path d="M80 160 H90 M160 140 H170 M160 160 H170 M250 170 H260" opacity="0.4" />
            </g>

            {/* Courier Figure on Bicycle */}
            {/* Bicycle Wheels */}
            <circle cx="140" cy="350" r="40" fill="none" stroke="#0D0D0D" strokeWidth="6" />
            <circle cx="140" cy="350" r="10" fill="#0D0D0D" />
            
            <circle cx="260" cy="350" r="40" fill="none" stroke="#0D0D0D" strokeWidth="6" />
            <circle cx="260" cy="350" r="10" fill="#0D0D0D" />
            
            {/* Bike Frame */}
            <path d="M140 350 L180 280 L250 280 L260 350 M180 280 L220 350" fill="none" stroke="#0D0D0D" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M240 250 L250 280 M170 270 L180 280" fill="none" stroke="#0D0D0D" strokeWidth="6" strokeLinecap="round" />
            
            {/* Courier Body */}
            {/* Backpack */}
            <rect x="90" y="180" width="50" height="70" rx="10" fill="#B4FF00" stroke="#0D0D0D" strokeWidth="5" />
            <path d="M105 180 V250 M125 180 V250" stroke="#0D0D0D" strokeWidth="3" opacity="0.5" />
            
            {/* Body */}
            <path d="M140 180 Q160 170 190 190 L170 260 H140 Z" fill="white" stroke="#0D0D0D" strokeWidth="5" strokeLinejoin="round" />
            
            {/* Legs */}
            <path d="M160 260 L180 320 L210 320" fill="none" stroke="#0D0D0D" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M150 260 L140 310 L160 310" fill="none" stroke="#0D0D0D" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Arms */}
            <path d="M170 200 L210 230 L245 250" fill="none" stroke="#0D0D0D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Head */}
            <circle cx="170" cy="140" r="25" fill="#FFD93D" stroke="#0D0D0D" strokeWidth="5" />
            {/* Helmet/Cap */}
            <path d="M140 140 Q170 110 200 140" fill="#0D0D0D" />
            <path d="M190 140 L210 140" stroke="#0D0D0D" strokeWidth="5" strokeLinecap="round" />
            
            {/* Face details (looking around) */}
            <circle cx="180" cy="145" r="3" fill="#0D0D0D" />
            <path d="M190 150 Q185 155 180 150" fill="none" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" />

            {/* Speech Bubble */}
            <path d="M240 120 C 240 70, 330 70, 330 120 C 330 160, 280 160, 260 190 C 260 160, 240 160, 240 120 Z" fill="#FFD93D" fillOpacity="0.8" stroke="#0D0D0D" strokeWidth="4" strokeLinejoin="round" />
            <text x="285" y="135" fontFamily="Space_Grotesk, sans-serif" fontWeight="900" fontSize="48" fill="#0D0D0D" textAnchor="middle">?</text>
            
            {/* Decorative motion/accent lines */}
            <path d="M50 380 L100 380 M280 380 L350 380" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
            <circle cx="80" cy="100" r="4" fill="#0D0D0D" />
            <circle cx="320" cy="220" r="6" fill="#B4FF00" stroke="#0D0D0D" strokeWidth="3" />
            <path d="M60 80 L70 70 M80 60 L90 70" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Text Section */}
        <div className="px-6 text-center mt-2 flex flex-col items-center">
          <h2 className="font-['Space_Grotesk',sans-serif] font-black text-4xl uppercase text-[#0D0D0D] tracking-tight leading-none mb-4">
            Тут пока пусто
          </h2>
          <p className="font-['Inter',sans-serif] font-medium text-lg text-[#1A1A1A] px-4">
            Первое нарушение — за тобой.
          </p>
        </div>

        {/* CTA Button */}
        <div className="absolute bottom-10 left-6 right-6">
          <button className="w-full bg-[#0D0D0D] text-white font-['Space_Grotesk',sans-serif] font-black text-xl uppercase py-5 rounded-full border-[4px] border-[#0D0D0D] hover:bg-white hover:text-[#0D0D0D] transition-colors shadow-[0_8px_0_#1A1A1A] active:translate-y-2 active:shadow-none flex items-center justify-center gap-2">
            <span className="text-[#B4FF00]">+</span> Сделать Чпок
          </button>
        </div>
      </div>
    </div>
  );
}
