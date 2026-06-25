import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    
    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 15; 
      btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const data = await registerUser(formData);
      if (data.success) {
        toast.success(data.message || 'Registration successful. Please log in.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration error');
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
        <div className="absolute bottom-margin-desktop left-margin-desktop text-white animate-reveal">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="font-display-lg text-display-lg tracking-tighter mb-stack-sm text-on-primary">Aura Eats</h1>
          </Link>
          <p className="font-body-lg text-body-lg text-on-primary/90 max-w-md">Join an exclusive network of culinary enthusiasts. Unprecedented taste awaits.</p>
        </div>
      </div>
      
      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface dark:bg-[#1a1c1c] overflow-hidden">
        {/* Subtle Background Blobs for Glass Effect Context */}
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-secondary-container/60 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-primary-fixed/40 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-[480px] bg-surface-container-lowest/70 dark:bg-[#121414]/70 backdrop-blur-[24px] border border-surface-variant/50 dark:border-gray-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] rounded-[24px] p-8 md:p-10 animate-reveal delay-100">
          <div className="mb-stack-lg">
            <h1 className="font-headline-xl text-headline-xl text-primary dark:text-white mb-2">Create Account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400">Join the exclusive world of Aura Eats.</p>
          </div>
          
          <form className="space-y-stack-md" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="animate-reveal delay-200">
              <label htmlFor="name" className="block font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 mb-2 ml-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant dark:text-gray-400">
                  <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>person</span>
                </span>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low dark:bg-[#1a1c1c] border border-transparent dark:border-gray-700 rounded-xl font-body-md text-body-md text-on-surface dark:text-white placeholder:text-on-surface-variant/50 focus:border-outline dark:focus:border-primary focus:ring-0 transition-colors" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Email Field */}
            <div className="animate-reveal delay-300">
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
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low dark:bg-[#1a1c1c] border border-transparent dark:border-gray-700 rounded-xl font-body-md text-body-md text-on-surface dark:text-white placeholder:text-on-surface-variant/50 focus:border-outline dark:focus:border-primary focus:ring-0 transition-colors" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="animate-reveal delay-400">
              <label htmlFor="password" className="block font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 mb-2 ml-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant dark:text-gray-400">
                  <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>lock</span>
                </span>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low dark:bg-[#1a1c1c] border border-transparent dark:border-gray-700 rounded-xl font-body-md text-body-md text-on-surface dark:text-white placeholder:text-on-surface-variant/50 focus:border-outline dark:focus:border-primary focus:ring-0 transition-colors" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Confirm Password Field */}
            <div className="animate-reveal delay-500">
              <label htmlFor="confirmPassword" className="block font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 mb-2 ml-1">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant dark:text-gray-400">
                  <span className="material-symbols-outlined icon-fill" style={{ fontSize: '20px' }}>lock_reset</span>
                </span>
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low dark:bg-[#1a1c1c] border border-transparent dark:border-gray-700 rounded-xl font-body-md text-body-md text-on-surface dark:text-white placeholder:text-on-surface-variant/50 focus:border-outline dark:focus:border-primary focus:ring-0 transition-colors" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Action Button */}
            <div className="pt-stack-sm animate-reveal delay-500">
              <button 
                ref={btnRef}
                type="submit" 
                disabled={loading}
                className="w-full relative overflow-hidden bg-primary dark:bg-white text-on-primary dark:text-black rounded-xl py-4 flex items-center justify-center gap-2 group hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-transform duration-300"
                style={{ transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
              >
                <span className="font-label-md text-label-md relative z-10">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}</span>
                {!loading && <span className="material-symbols-outlined relative z-10 transition-transform duration-300 group-hover:translate-x-1" style={{ fontSize: '20px' }}>arrow_forward</span>}
              </button>
            </div>
          </form>
          
          {/* Footer Link */}
          <div className="mt-stack-md text-center animate-reveal delay-[600ms]">
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400">
              Already have an account? 
              <Link to="/login" className="font-label-md text-label-md text-primary dark:text-white hover:text-on-surface-variant dark:hover:text-gray-400 transition-colors ml-1">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
