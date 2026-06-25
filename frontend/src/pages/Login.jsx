import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../services/authService';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    
    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const distanceX = (x - centerX) / centerX;
      const distanceY = (y - centerY) / centerY;
      
      const strength = 10;
      
      btn.style.transform = `translate(${distanceX * strength}px, ${distanceY * strength}px)`;
    };
    
    const handleMouseLeave = () => {
      btn.style.transform = 'translate(0px, 0px)';
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data.success) {
        login(data.user, data.token);
        toast.success('Welcome back!');
        if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'vendor') navigate('/vendor');
        else navigate('/products');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full relative overflow-hidden bg-background dark:bg-[#1a1c1c] pt-[72px]">
      {/* Left Side: High-Fidelity Imagery */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-container-highest items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBXUd_IdKVqomvzKEu4fzrZqsNPFukmJ-o-NqT4R4qN9nInjMahjMTkgSd87cXwCONaqzynYiXKf4JN0Ad1brY1hdW4djD9T1FPQsYMUSVE1rO_wi1aGqIB8kyormOsh1riCStYbkpKK6otCZy2U1McyLa2_ckso3ry3pbnC_eHeNu4j1zouoHODMGvQgtY3qKSY6lFDpM7bRNqxpZT-oE_nV1fbJDpkqvVTb4r3XN-YLmoQEAkfIsSUI4QCQf2wWPAQzD3ktCMNS0')" }}
        ></div>
        {/* Subtle Overlay for branding */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
        <div className="absolute bottom-margin-desktop left-margin-desktop text-white animate-reveal">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="font-display-lg text-display-lg tracking-tighter mb-stack-sm text-on-primary">Aura Eats</h1>
          </Link>
          <p className="font-body-lg text-body-lg text-on-primary/90 max-w-md">Experience culinary excellence, curated for the modern connoisseur. Your exquisite journey begins here.</p>
        </div>
      </div>
      
      {/* Right Side: Authentication Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-margin-mobile md:p-margin-desktop relative z-10">
        {/* Mobile Background */}
        <div 
          className="absolute inset-0 w-full h-full lg:hidden bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdhatDGXE3xBlNF_CuQY3HtJyaHwCTcneIstcScM-oG7Jx82oBNuKneDCarOhkHkAAfW13MybPji-EVV8NG3mgcwmXqJ3adA-i4lhGESBlEYuIB0MhxDKw339C1PMH37F_iOZYTTYqco_FtYErxfX02TmE8QQCI8lcqln02SPDGWuPcCDhryIQRreT28Xsn_t5Fmfbysytuq56Vz4CcueOE4Uwd91Bt4owAi_nD6x5dE3CH0xPUekxEgOixon-LOiMnmHich0Sn5I')" }}
        ></div>
        <div className="absolute inset-0 bg-surface/90 backdrop-blur-xl lg:hidden"></div>
        
        <div className="w-full max-w-md glass-panel dark:bg-[#121414]/90 dark:border dark:border-gray-800 p-stack-lg rounded-[24px] relative animate-reveal">
          {/* Toggle Context */}
          <div className="flex justify-between items-center mb-stack-lg animate-reveal delay-100">
            <h2 className="font-headline-lg text-headline-lg text-primary dark:text-white tracking-tight">Sign In</h2>
            <Link to="/register" className="font-label-md text-label-md text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">Create account</Link>
          </div>
          
          <form className="space-y-stack-md relative z-20" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="animate-reveal delay-200">
              <label htmlFor="email" className="block font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant dark:text-gray-400">
                  <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>mail</span>
                </span>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest/50 dark:bg-[#1a1c1c] border border-outline-variant/50 dark:border-gray-700 rounded-xl font-body-md text-body-md text-on-background dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="animate-reveal delay-300">
              <label htmlFor="password" className="block font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 mb-2 ml-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant dark:text-gray-400">
                  <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>lock</span>
                </span>
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  required 
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-lowest/50 dark:bg-[#1a1c1c] border border-outline-variant/50 dark:border-gray-700 rounded-xl font-body-md text-body-md text-on-background dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div 
                  className="absolute right-4 top-4 cursor-pointer text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined icon-fill">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </div>
              </div>
            </div>
            
            {/* Options */}
            <div className="flex items-center justify-between animate-reveal delay-300 mt-stack-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-surface" />
                <span className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 group-hover:text-on-background dark:group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link to="#" className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors underline decoration-1 underline-offset-2">Forgot password?</Link>
            </div>
            
            {/* Primary Action */}
            <div className="pt-stack-sm animate-reveal delay-300">
              <button 
                ref={btnRef}
                type="submit" 
                disabled={loading}
                className="magnetic-button w-full bg-primary dark:bg-white text-on-primary dark:text-black rounded-xl py-4 font-label-md text-label-md flex justify-center items-center gap-2 hover:bg-on-background dark:hover:bg-gray-200 shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all relative overflow-hidden group"
                style={{ transition: 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)' }}
              >
                <span className="relative z-10">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Aura Eats'}</span>
                {!loading && <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform" style={{ fontSize: '18px' }}>arrow_forward</span>}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </button>
            </div>
          </form>
          

        </div>
      </div>
    </div>
  );
};

export default Login;
