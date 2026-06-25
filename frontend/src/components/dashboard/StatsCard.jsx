import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import clsx from 'clsx';

const StatsCard = ({ 
  label, 
  value, 
  prefix = '', 
  suffix = '',
  icon, 
  color = '#3B82F6',
  trendValue, // e.g. +5%
  trendUp = true,
  className
}) => {
  const counterRef = useRef(null);

  useEffect(() => {
    if (counterRef.current && value !== undefined && value !== null) {
      const target = parseFloat(value);
      gsap.to(counterRef.current, {
        innerHTML: target,
        duration: 1.5,
        ease: "power2.out",
        snap: { innerHTML: 1 },
        onUpdate: function () {
          const num = Math.round(this.targets()[0].innerHTML);
          counterRef.current.innerHTML = `${prefix}${num.toLocaleString()}${suffix}`;
        }
      });
    }
  }, [value, prefix, suffix]);

  return (
    <div className={clsx(
      "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15`, color: color }}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <p className="font-label-md text-label-md text-on-primary-container mb-1">{label}</p>
      
      <h3
        className="font-display-lg text-white text-[32px] md:text-[36px] tracking-tight relative z-10"
        ref={counterRef}
      >
        {prefix}0{suffix}
      </h3>

      {trendValue && (
        <div className={clsx("mt-4 flex items-center gap-2 font-label-sm text-label-sm", trendUp ? "text-[#10B981]" : "text-[#EF4444]")}>
          <span className="material-symbols-outlined text-[14px]">{trendUp ? 'trending_up' : 'trending_down'}</span>
          <span>{trendValue}</span>
        </div>
      )}

      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity z-0 text-white">
        <span className="material-symbols-outlined text-[100px] pointer-events-none">{icon}</span>
      </div>
    </div>
  );
};

export default StatsCard;
