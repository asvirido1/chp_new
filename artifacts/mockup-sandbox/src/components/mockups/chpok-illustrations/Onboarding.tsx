import React from "react";

export function Onboarding() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      {/* Mobile Device Mockup */}
      <div 
        className="relative overflow-hidden shadow-2xl rounded-[40px] ring-8 ring-neutral-800"
        style={{ width: 390, height: 844, backgroundColor: "#F5D0C5" }}
      >
        
        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 z-20 flex justify-between items-center px-6 pt-14">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white border-2 border-[#0D0D0D]" />
            <div className="w-6 h-2 rounded-full bg-[#B4FF00] border-2 border-[#0D0D0D]" />
            <div className="w-2 h-2 rounded-full bg-white border-2 border-[#0D0D0D]" />
          </div>
          <button className="text-[#0D0D0D] font-bold uppercase tracking-wider text-sm hover:opacity-70 transition-opacity">
            Пропустить
          </button>
        </div>

        {/* Hero Illustration Area */}
        <div className="relative w-full h-[460px] flex items-end justify-center pt-24">
          <svg width="390" height="420" viewBox="0 0 390 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0">
            {/* Backdrop Circle */}
            <circle cx="195" cy="210" r="160" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />
            
            {/* City/Road Elements Background */}
            <path d="M 35 320 L 355 320" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
            <path d="M 60 280 L 120 280" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
            <path d="M 280 270 L 320 270" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
            
            {/* Scooter Background */}
            <g transform="translate(180, 160)">
              {/* Wheels */}
              <circle cx="30" cy="150" r="16" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />
              <circle cx="120" cy="150" r="16" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />
              {/* Deck */}
              <rect x="30" y="140" width="90" height="10" fill="#B4FF00" stroke="#0D0D0D" strokeWidth="4" rx="4" />
              {/* Stem */}
              <path d="M 115 140 L 95 40" stroke="#0D0D0D" strokeWidth="6" strokeLinecap="round" />
              {/* Handlebars */}
              <path d="M 85 40 L 115 35" stroke="#0D0D0D" strokeWidth="6" strokeLinecap="round" />
              {/* Dash */}
              <rect x="90" y="30" width="12" height="15" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" rx="2" />
            </g>

            {/* Character */}
            <g transform="translate(60, 120)">
              {/* Legs */}
              <path d="M 80 120 L 70 200 L 90 200 Z" fill="#1A1A1A" stroke="#0D0D0D" strokeWidth="4" strokeLinejoin="round" />
              <path d="M 110 120 L 130 190 L 150 190 Z" fill="#1A1A1A" stroke="#0D0D0D" strokeWidth="4" strokeLinejoin="round" />
              
              {/* Body / Jacket */}
              <path d="M 40 50 C 60 40, 120 40, 140 70 C 150 90, 130 140, 110 140 C 90 140, 60 140, 50 120 Z" fill="#FFD93D" stroke="#0D0D0D" strokeWidth="4" strokeLinejoin="round" />
              
              {/* Head */}
              <circle cx="85" cy="25" r="22" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />
              {/* Hair/Cap */}
              <path d="M 63 25 C 63 10, 107 10, 107 25 C 107 35, 63 35, 63 25 Z" fill="#0D0D0D" />
              
              {/* Arms */}
              <path d="M 70 60 L 140 30 L 155 45" fill="none" stroke="#0D0D0D" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 120 70 L 150 45 L 165 60" fill="none" stroke="#0D0D0D" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Phone */}
              <rect x="155" y="30" width="20" height="35" rx="3" fill="#B4FF00" stroke="#0D0D0D" strokeWidth="4" transform="rotate(20 155 30)" />
              
              {/* Flash / Camera Emphasis */}
              <g transform="translate(185, 30)">
                <path d="M 0 -15 L 0 -5" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
                <path d="M 15 -10 L 10 -2" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
                <path d="M 20 5 L 10 5" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
                <path d="M 15 20 L 10 12" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
                <path d="M 0 25 L 0 15" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
              </g>
            </g>

            {/* Extra decorative marks */}
            <path d="M 40 90 L 50 75 L 65 85" fill="none" stroke="#0D0D0D" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="320" cy="80" r="6" fill="#1A1A1A" />
            <circle cx="335" cy="95" r="4" fill="#B4FF00" stroke="#0D0D0D" strokeWidth="2" />
          </svg>
        </div>

        {/* Bottom Card */}
        <div className="absolute bottom-0 inset-x-0 h-[400px] bg-white rounded-t-[40px] border-t-4 border-[#0D0D0D] px-6 pt-10 pb-8 flex flex-col">
          
          <div className="flex-1">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[#B4FF00] border-2 border-[#0D0D0D] rounded-full mb-6">
              <span className="font-bold text-xs uppercase tracking-widest text-[#0D0D0D]">Шаг 02</span>
            </div>
            
            <h1 className="text-3xl font-black uppercase text-[#0D0D0D] leading-[1.1] mb-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" }}>
              Сфотографируй<br/>нарушение
            </h1>
            
            <p className="text-[#1A1A1A] text-lg font-medium leading-relaxed" style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
              Сделай фото — приложение автоматически добавит геолокацию и время.
            </p>
          </div>

          <button className="w-full h-16 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">
            <span className="font-bold text-lg uppercase tracking-wider">Далее</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
