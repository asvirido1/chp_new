import React from "react";

export function HomeHero() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 font-sans">
      <div 
        className="relative overflow-hidden shadow-2xl rounded-[40px] border-[8px] border-black"
        style={{ width: 390, height: 844, backgroundColor: "#F5D0C5" }}
      >
        {/* Top Nav */}
        <div className="absolute top-0 left-0 right-0 px-6 pt-12 pb-4 flex justify-between items-center z-20">
          <div 
            className="text-2xl font-black tracking-tighter"
            style={{ color: "#0D0D0D", fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" }}
          >
            ЧПОК!
          </div>
          <div 
            className="w-10 h-10 rounded-full border-[3px]"
            style={{ 
              backgroundColor: "#1A1A1A", 
              borderColor: "#0D0D0D",
              boxShadow: "2px 2px 0px #0D0D0D" 
            }}
          />
        </div>

        {/* Hero Illustration Area */}
        <div className="absolute top-[100px] left-4 right-4 h-[440px] z-10">
          {/* White backdrop block with harsh shadow */}
          <div 
            className="absolute inset-0 bg-white border-[4px]"
            style={{ 
              borderColor: "#0D0D0D",
              boxShadow: "6px 6px 0px #0D0D0D",
              borderRadius: "24px",
              transform: "rotate(-1deg)"
            }}
          />
          
          {/* SVG Illustration */}
          <div className="relative w-full h-full overflow-hidden rounded-[20px]">
            <svg viewBox="0 0 358 440" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background Cityscape */}
              <path d="M-10 380 L30 380 L30 250 L80 250 L80 380 L140 380 L140 180 L200 180 L200 380 L260 380 L260 220 L320 220 L320 380 L380 380 L380 440 L-10 440 Z" fill="#F5D0C5" stroke="#0D0D0D" strokeWidth="4" strokeLinejoin="round"/>
              
              {/* Windows in City */}
              <rect x="45" y="270" width="20" height="20" fill="#0D0D0D" />
              <rect x="45" y="310" width="20" height="20" fill="#0D0D0D" />
              <rect x="45" y="350" width="20" height="20" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />
              
              <rect x="155" y="210" width="30" height="30" fill="#0D0D0D" />
              <rect x="155" y="260" width="30" height="30" fill="#0D0D0D" />
              <rect x="155" y="310" width="30" height="30" fill="#FFD93D" stroke="#0D0D0D" strokeWidth="4" />
              
              <rect x="275" y="250" width="30" height="80" fill="#0D0D0D" />
              
              {/* Sun/Moon geometric shape */}
              <circle cx="280" cy="90" r="40" fill="#FFD93D" stroke="#0D0D0D" strokeWidth="4" />
              
              {/* Road / Ground */}
              <path d="M-10 400 L380 400" stroke="#0D0D0D" strokeWidth="6" strokeDasharray="15 15" />
              
              {/* Motion Lines */}
              <line x1="20" y1="200" x2="100" y2="200" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
              <line x1="40" y1="220" x2="80" y2="220" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
              <line x1="10" y1="310" x2="60" y2="310" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" />
              
              {/* Scooter & Courier */}
              <g transform="translate(60, 140)">
                {/* Scooter Body */}
                <path d="M40 220 L160 220 L180 180 L200 180" stroke="#0D0D0D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M160 220 L140 150 L120 150" stroke="#0D0D0D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Scooter Wheels */}
                <circle cx="50" cy="220" r="24" fill="#1A1A1A" stroke="#0D0D0D" strokeWidth="6" />
                <circle cx="50" cy="220" r="10" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />
                
                <circle cx="160" cy="220" r="24" fill="#1A1A1A" stroke="#0D0D0D" strokeWidth="6" />
                <circle cx="160" cy="220" r="10" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />
                
                {/* Courier Body (Acid Green Jacket) */}
                <path d="M90 140 C90 100, 110 80, 150 80 L170 80 L180 120 L130 160 L100 160 Z" fill="#B4FF00" stroke="#0D0D0D" strokeWidth="6" strokeLinejoin="round" />
                
                {/* Courier Leg */}
                <path d="M120 140 L110 190 L80 190 L80 210 L120 210 L135 160" fill="#FFD93D" stroke="#0D0D0D" strokeWidth="6" strokeLinejoin="round" />
                <path d="M80 190 L60 190 L60 210 L80 210 Z" fill="#1A1A1A" stroke="#0D0D0D" strokeWidth="6" strokeLinejoin="round" />
                
                {/* Courier Arm */}
                <path d="M140 100 L180 130 L190 120 L150 90 Z" fill="#B4FF00" stroke="#0D0D0D" strokeWidth="6" strokeLinejoin="round" />
                
                {/* Courier Helmet / Head */}
                <path d="M140 80 C140 40, 190 40, 190 80 L140 80 Z" fill="#1A1A1A" stroke="#0D0D0D" strokeWidth="6" strokeLinejoin="round" />
                <rect x="160" y="50" width="35" height="15" rx="7.5" fill="#FFFFFF" stroke="#0D0D0D" strokeWidth="4" />
                
                {/* Backpack (Delivery Box) */}
                <rect x="50" y="60" width="60" height="80" rx="8" fill="#FFD93D" stroke="#0D0D0D" strokeWidth="6" transform="rotate(-10 50 60)" />
                <line x1="70" y1="80" x2="100" y2="80" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" transform="rotate(-10 50 60)" />
                <line x1="70" y1="100" x2="90" y2="100" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" transform="rotate(-10 50 60)" />
              </g>
              
              {/* Foreground details */}
              <circle cx="30" cy="400" r="4" fill="#0D0D0D" />
              <circle cx="120" cy="420" r="6" fill="#0D0D0D" />
              <circle cx="250" cy="390" r="5" fill="#0D0D0D" />
            </svg>
          </div>
        </div>

        {/* Content Below Hero */}
        <div className="absolute top-[560px] left-6 right-6 z-20 flex flex-col gap-4">
          
          {/* Tag */}
          <div className="self-start px-3 py-1.5 border-[3px]"
            style={{ 
              backgroundColor: "#B4FF00",
              borderColor: "#0D0D0D",
              boxShadow: "3px 3px 0px #0D0D0D",
              borderRadius: "8px",
              transform: "rotate(-2deg)"
            }}
          >
            <span 
              className="text-[11px] font-bold tracking-widest"
              style={{ color: "#0D0D0D", fontFamily: "'Inter', 'DM Sans', sans-serif" }}
            >
              НАРОДНЫЙ КОНТРОЛЬ
            </span>
          </div>

          {/* Headline */}
          <h1 
            className="text-[40px] leading-[0.95] font-black uppercase tracking-tight"
            style={{ 
              color: "#0D0D0D", 
              fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
              textShadow: "1px 1px 0px #FFFFFF, -1px -1px 0px #FFFFFF, 1px -1px 0px #FFFFFF, -1px 1px 0px #FFFFFF"
            }}
          >
            Один чпок —<br />
            нарушение<br />
            замечено.
          </h1>
        </div>

        {/* Bottom Bar Area */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-4">
          
          {/* Stats Row */}
          <div className="flex justify-between items-center px-1">
            {[
              { label: "жалоб сегодня", value: "1,240" },
              { label: "в очереди", value: "342" },
              { label: "решено", value: "898" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-start gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: "#0D0D0D", fontFamily: "'Inter', sans-serif" }}>
                  {stat.label}
                </span>
                <span className="text-sm font-black" style={{ color: "#0D0D0D", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button 
            className="w-full h-16 rounded-[20px] border-[4px] flex items-center justify-center relative active:translate-y-1 active:shadow-[0px_0px_0px_#0D0D0D] transition-all"
            style={{ 
              backgroundColor: "#B4FF00",
              borderColor: "#0D0D0D",
              boxShadow: "4px 4px 0px #0D0D0D"
            }}
          >
            <span 
              className="text-2xl font-black uppercase tracking-wide"
              style={{ color: "#0D0D0D", fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" }}
            >
              #ЧПОКНУТЬ
            </span>
            <div className="absolute right-4 w-8 h-8 rounded-full border-[3px] border-black bg-white flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </div>
        
      </div>
    </div>
  );
}
