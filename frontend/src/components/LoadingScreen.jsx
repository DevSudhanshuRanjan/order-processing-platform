import { useState, useEffect } from 'react';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2500; // 2.5s total
    const interval = 30; // update every 30ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          // Brief pause at 100%, then fade out
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              setShow(false);
              if (onFinish) onFinish();
            }, 500);
          }, 400);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onFinish]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0d0d] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      ></div>

      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#F97316]/5 blur-[120px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#F97316] flex items-center justify-center shadow-lg shadow-[#F97316]/20">
            <span className="material-symbols-outlined text-white text-3xl icon-fill">restaurant_menu</span>
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            AURA<span className="text-[#F97316]">EATS</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-white/40 text-sm font-medium tracking-[0.15em] uppercase">
          Elevating dining experiences
        </p>

        {/* Loading indicator */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-white/60 text-xs font-medium tracking-[0.2em] uppercase">
            Loading
          </span>
          <span className="flex gap-[3px]">
            <span className="w-[3px] h-[3px] rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.2s' }}></span>
            <span className="w-[3px] h-[3px] rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.2s' }}></span>
            <span className="w-[3px] h-[3px] rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.2s' }}></span>
          </span>
        </div>
      </div>

      {/* Bottom Progress Bar - GTA Style */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Progress percentage */}
        <div className="flex justify-between items-center px-8 pb-3">
          <span className="text-white/30 text-[10px] font-medium tracking-[0.15em] uppercase">
            Initializing
          </span>
          <span className="text-white/60 text-xs font-mono font-medium tabular-nums">
            {Math.floor(progress)}%
          </span>
        </div>

        {/* Thin progress bar */}
        <div className="h-[3px] bg-white/5 w-full">
          <div
            className="h-full bg-[#F97316] transition-all duration-[30ms] ease-linear relative"
            style={{ width: `${progress}%` }}
          >
            {/* Glow effect */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60px] h-[8px] bg-[#F97316]/40 blur-[6px]"></div>
          </div>
        </div>

        {/* Bottom edge line */}
        <div className="h-[1px] bg-white/[0.02]"></div>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-8 left-8 w-8 h-[1px] bg-white/[0.06]"></div>
      <div className="absolute top-8 left-8 w-[1px] h-8 bg-white/[0.06]"></div>
      <div className="absolute top-8 right-8 w-8 h-[1px] bg-white/[0.06]"></div>
      <div className="absolute top-8 right-8 w-[1px] h-8 bg-white/[0.06]"></div>
    </div>
  );
};

export default LoadingScreen;