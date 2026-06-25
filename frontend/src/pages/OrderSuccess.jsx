import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const OrderSuccess = () => {
  const containerRef = useRef(null);
  const particleRef = useRef([]);

  useEffect(() => {
    // GSAP animations for the main container
    gsap.fromTo(
      containerRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );

    gsap.fromTo(
      containerRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "cubic-bezier(0.16, 1, 0.3, 1)", delay: 0.2 }
    );

    // Floating particles
    particleRef.current.forEach((particle, i) => {
      gsap.to(particle, {
        y: -100,
        x: 'random(-20, 20)',
        opacity: 0,
        duration: 'random(3, 6)',
        repeat: -1,
        delay: i * 0.5,
        ease: 'none'
      });
    });
  }, []);

  return (
    <div className="bg-surface dark:bg-[#1a1c1c] min-h-[calc(100vh-80px)] flex items-center justify-center font-body-md text-on-surface dark:text-white overflow-hidden relative">
      {/* Atmospheric Background (Quiet Celebration) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-surface-container-high dark:bg-gray-800 rounded-full blur-[100px] animate-pulse mix-blend-multiply opacity-50 duration-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-surface-variant dark:bg-gray-700 rounded-full blur-[80px] animate-pulse mix-blend-multiply opacity-40 duration-1000 delay-500"></div>
        
        {/* Elegant Particles */}
        <div ref={el => particleRef.current[0] = el} className="absolute bg-black/10 dark:bg-white/10 rounded-full w-12 h-12 top-[30%] left-[20%]"></div>
        <div ref={el => particleRef.current[1] = el} className="absolute bg-black/10 dark:bg-white/10 rounded-full w-8 h-8 top-[60%] left-[15%]"></div>
        <div ref={el => particleRef.current[2] = el} className="absolute bg-black/10 dark:bg-white/10 rounded-full w-16 h-16 top-[40%] right-[25%]"></div>
        <div ref={el => particleRef.current[3] = el} className="absolute bg-black/10 dark:bg-white/10 rounded-full w-10 h-10 top-[70%] right-[15%]"></div>
      </div>
      
      {/* Main Success Canvas */}
      <main className="relative z-10 w-full max-w-[520px] px-margin-mobile md:px-0">
        <div ref={containerRef} className="bg-surface-container-lowest dark:bg-[#121414] rounded-3xl p-8 md:p-12 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] border border-surface-container dark:border-gray-800 flex flex-col items-center text-center">
          
          {/* Animated Checkmark */}
          <div className="w-24 h-24 rounded-full bg-primary dark:bg-white flex items-center justify-center mb-stack-md shadow-lg shadow-primary/20 relative">
            <div className="absolute inset-0 rounded-full border-2 border-primary dark:border-white animate-ping opacity-20"></div>
            <span className="material-symbols-outlined text-on-primary dark:text-black text-[48px] icon-fill">check</span>
          </div>
          
          {/* Typography */}
          <h1 className="font-headline-xl text-headline-xl text-primary dark:text-white mb-base">Order Confirmed!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-gray-400 mb-stack-lg">Your delicious meal is on its way.</p>
          
          {/* Order Details Box */}
          <div className="w-full bg-surface-bright dark:bg-[#1a1c1c] rounded-2xl p-6 mb-stack-lg border border-surface-variant dark:border-gray-800 flex flex-col md:flex-row gap-6 md:gap-0 justify-between text-left relative overflow-hidden group hover:shadow-sm transition-shadow duration-300">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary dark:bg-white transform origin-left transition-transform duration-300"></div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 uppercase tracking-wider">Order ID</span>
              <span className="font-label-md text-label-md text-primary dark:text-white">#ORD-{Math.floor(1000 + Math.random() * 9000)}</span>
            </div>
            <div className="w-px h-full bg-surface-variant dark:bg-gray-800 hidden md:block"></div>
            <div className="h-px w-full bg-surface-variant dark:bg-gray-800 md:hidden"></div>
            <div className="flex flex-col gap-1 md:text-right">
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 uppercase tracking-wider">Est. Delivery</span>
              <span className="font-label-md text-label-md text-primary dark:text-white flex items-center gap-2 md:justify-end">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                25-35 mins
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="w-full flex flex-col gap-4">
            <button className="w-full bg-primary dark:bg-white text-on-primary dark:text-black font-label-md text-label-md py-4 px-6 rounded-xl hover:bg-inverse-surface transition-all duration-300 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2 group">
              Track Order
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <Link to="/" className="w-full bg-transparent text-primary dark:text-white font-label-md text-label-md py-4 px-6 rounded-xl hover:bg-surface-container dark:hover:bg-gray-800 transition-colors duration-300">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
