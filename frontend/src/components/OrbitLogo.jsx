import React from 'react'

export function OrbitLogo({ size = 26, className = "" }) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 blur-[6px] opacity-70 animate-pulse" 
      />
      
      {/* SVG Icon with orbital ring */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="orbitGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="coreGrad" x1="12" y1="12" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>
        </defs>

        {/* Outer Orbit Path */}
        <ellipse 
          cx="16" 
          cy="16" 
          rx="13" 
          ry="6" 
          transform="rotate(-28 16 16)" 
          stroke="url(#orbitGrad)" 
          strokeWidth="1.8" 
          strokeDasharray="3 1.5"
          opacity="0.85"
        />

        {/* Orbit Satellite Node */}
        <circle 
          cx="26" 
          cy="11" 
          r="2.2" 
          fill="#38BDF8" 
        />

        {/* Inner Glowing Core */}
        <circle 
          cx="16" 
          cy="16" 
          r="5.5" 
          fill="url(#coreGrad)" 
        />
        
        {/* Core highlight dot */}
        <circle 
          cx="14.8" 
          cy="14.8" 
          r="1.4" 
          fill="#FFFFFF" 
          opacity="0.9"
        />
      </svg>
    </div>
  )
}

export default OrbitLogo
