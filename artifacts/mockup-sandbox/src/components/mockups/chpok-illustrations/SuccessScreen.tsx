import React from 'react';

export function SuccessScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      {/* Mobile Device Mockup */}
      <div 
        className="relative overflow-hidden shadow-2xl flex flex-col"
        style={{
          width: '390px',
          height: '844px',
          backgroundColor: '#F5D0C5',
          borderRadius: '40px',
          border: '14px solid #0D0D0D',
        }}
      >
        {/* Top Header overlay */}
        <div className="absolute top-0 w-full flex justify-between items-center px-6 pt-12 pb-4 z-10 pointer-events-none">
          <div className="text-white font-['Space_Grotesk'] font-black tracking-widest text-lg" style={{ fontFamily: 'Space Grotesk, DM Sans, sans-serif' }}>
            ЧПОК!
          </div>
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
          </div>
        </div>

        {/* TOP SECTION: ILLUSTRATION (60%) */}
        <div 
          className="relative flex-shrink-0 flex items-center justify-center"
          style={{ height: '55%', backgroundColor: '#0D0D0D' }}
        >
          {/* Confetti & Burst rays */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 460" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Burst rays */}
            <path d="M195 230 L50 50" stroke="#B4FF00" strokeWidth="8" strokeLinecap="round" strokeDasharray="10 20" />
            <path d="M195 230 L340 50" stroke="#B4FF00" strokeWidth="12" strokeLinecap="round" />
            <path d="M195 230 L50 350" stroke="#B4FF00" strokeWidth="6" strokeLinecap="round" />
            <path d="M195 230 L350 400" stroke="#B4FF00" strokeWidth="14" strokeLinecap="round" strokeDasharray="20 20" />
            <path d="M195 230 L20 200" stroke="#B4FF00" strokeWidth="8" strokeLinecap="round" />
            <path d="M195 230 L370 200" stroke="#B4FF00" strokeWidth="10" strokeLinecap="round" />
            
            {/* Shapes / Confetti */}
            {/* Lime square */}
            <rect x="60" y="100" width="24" height="24" fill="#B4FF00" stroke="#F5D0C5" strokeWidth="3" transform="rotate(15 60 100)" />
            {/* Yellow circle */}
            <circle cx="300" cy="120" r="14" fill="#FFD93D" stroke="#0D0D0D" strokeWidth="4" />
            {/* Lime triangle */}
            <polygon points="90,360 120,390 70,400" fill="#B4FF00" stroke="#0D0D0D" strokeWidth="4" />
            {/* Yellow star/burst */}
            <path d="M310 280 L320 300 L340 305 L325 320 L330 340 L310 330 L290 340 L295 320 L280 305 L300 300 Z" fill="#FFD93D" stroke="#F5D0C5" strokeWidth="3" />
            {/* Little white dots */}
            <circle cx="150" cy="80" r="5" fill="#FFFFFF" />
            <circle cx="280" cy="220" r="4" fill="#FFFFFF" />
            <circle cx="80" cy="280" r="6" fill="#FFFFFF" />
            
            {/* Scooter silhouette small top right */}
            <g transform="translate(320, 30) scale(0.4)">
              <circle cx="30" cy="60" r="10" fill="#F5D0C5" />
              <circle cx="90" cy="60" r="10" fill="#F5D0C5" />
              <path d="M30 60 L90 60" stroke="#F5D0C5" strokeWidth="6" strokeLinecap="round" />
              <path d="M80 60 L70 20 L60 20" stroke="#F5D0C5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 60 L40 10 L50 10" stroke="#F5D0C5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>

          {/* Main Character / Fist & Phone */}
          <svg className="relative z-10 w-full h-full" viewBox="0 0 390 460" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Flash burst behind phone */}
            <circle cx="260" cy="180" r="60" fill="#FFFFFF" opacity="0.9" filter="blur(4px)" />
            <path d="M260 100 L260 260 M180 180 L340 180 M200 120 L320 240 M200 240 L320 120" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            
            {/* The Arm */}
            {/* Sleeve */}
            <path d="M120 460 L140 320 L220 300 L240 460 Z" fill="#FFD93D" stroke="#F5D0C5" strokeWidth="6" strokeLinejoin="round" />
            
            {/* Hand / Fist */}
            <path d="M180 290 C160 290 140 270 140 240 C140 210 160 190 190 190 C220 190 230 210 230 230 C230 250 210 270 180 290 Z" fill="#F5D0C5" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
            <rect x="150" y="200" width="70" height="40" rx="20" fill="#F5D0C5" stroke="#FFFFFF" strokeWidth="6" transform="rotate(-15 150 200)" />
            <rect x="145" y="220" width="60" height="30" rx="15" fill="#F5D0C5" stroke="#FFFFFF" strokeWidth="5" transform="rotate(-10 145 220)" />

            {/* Phone */}
            <rect x="170" y="140" width="80" height="150" rx="12" fill="#1A1A1A" stroke="#B4FF00" strokeWidth="6" transform="rotate(15 170 140)" />
            {/* Screen */}
            <rect x="180" y="150" width="60" height="120" rx="6" fill="#FFFFFF" transform="rotate(15 170 140)" />
            {/* Camera lens */}
            <circle cx="210" cy="155" r="8" fill="#B4FF00" transform="rotate(15 170 140)" />
            {/* Flash dot */}
            <circle cx="230" cy="155" r="4" fill="#FFFFFF" transform="rotate(15 170 140)" />
            
            {/* Overlapping fingers on phone */}
            <path d="M165 240 C190 230 210 240 210 260 C210 280 190 290 165 280 Z" fill="#F5D0C5" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
          </svg>
        </div>

        {/* BOTTOM SECTION: TEXT & ACTIONS (45%) */}
        <div className="flex-1 flex flex-col justify-between p-6 pb-10" style={{ backgroundColor: '#F5D0C5' }}>
          
          <div className="flex flex-col flex-1 mt-2">
            <h1 
              className="font-black text-[#0D0D0D] leading-none tracking-tighter"
              style={{ 
                fontFamily: 'Space Grotesk, DM Sans, sans-serif',
                fontSize: '4rem', // huge
                marginBottom: '1rem'
              }}
            >
              ЧПОК!
            </h1>
            
            <h2 
              className="text-2xl font-black text-[#0D0D0D] mb-3 leading-tight"
              style={{ fontFamily: 'Space Grotesk, DM Sans, sans-serif' }}
            >
              НАРУШЕНИЕ<br/>ЗАФИКСИРОВАНО
            </h2>
            
            <p className="text-[#1A1A1A] font-medium text-base leading-snug mb-5" style={{ fontFamily: 'Inter, DM Sans, sans-serif' }}>
              Жалоба <span className="font-bold bg-[#B4FF00] px-1">#1042</span> отправлена в Центр организации дорожного движения.
            </p>

            {/* Metadata chip */}
            <div className="flex items-center space-x-3 mb-auto">
              <span className="text-[#1A1A1A] font-bold text-sm bg-white border-[3px] border-[#0D0D0D] px-3 py-1.5 rounded-full shadow-[2px_2px_0px_0px_#0D0D0D]">
                На рассмотрении
              </span>
              <span className="text-[#0D0D0D] font-bold opacity-60 text-sm">
                Сегодня, 14:32
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button className="flex-1 bg-transparent border-4 border-[#0D0D0D] text-[#0D0D0D] font-black uppercase tracking-wider py-4 px-2 rounded-xl text-sm transition-transform active:translate-y-1 shadow-[4px_4px_0px_0px_#0D0D0D] active:shadow-[0px_0px_0px_0px_#0D0D0D]" style={{ fontFamily: 'Space Grotesk, DM Sans, sans-serif' }}>
              Поделиться
            </button>
            <button className="flex-1 bg-[#B4FF00] border-4 border-[#0D0D0D] text-[#0D0D0D] font-black uppercase tracking-wider py-4 px-2 rounded-xl text-sm transition-transform active:translate-y-1 shadow-[4px_4px_0px_0px_#0D0D0D] active:shadow-[0px_0px_0px_0px_#0D0D0D]" style={{ fontFamily: 'Space Grotesk, DM Sans, sans-serif' }}>
              На главную
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
