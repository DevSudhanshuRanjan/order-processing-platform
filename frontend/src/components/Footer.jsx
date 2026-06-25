import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-surface-container-lowest dark:bg-[#121414] border-t border-outline-variant dark:border-gray-800 transition-all duration-200 mt-stack-lg mt-auto">
      <div className="w-full px-margin-desktop py-stack-lg grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto">
        {/* Brand & Copyright */}
      <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
        <Link className="font-headline-lg text-headline-lg text-primary dark:text-white" to="/">Aura Eats</Link>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400">
          &copy; {new Date().getFullYear()} Aura Eats. All rights reserved.
        </p>
      </div>
      
      {/* Links Columns */}
      <div className="flex flex-col gap-3">
        <h4 className="font-label-md text-label-md text-primary dark:text-white font-semibold mb-2">Company</h4>
        <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors" to="#">About Us</Link>
        <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors" to="#">Careers</Link>
        <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors" to="#">Press</Link>
      </div>
      
      <div className="flex flex-col gap-3">
        <h4 className="font-label-md text-label-md text-primary dark:text-white font-semibold mb-2">Support</h4>
        <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors" to="#">Help Center</Link>
        <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors" to="#">Terms of Service</Link>
        <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors" to="#">Privacy Policy</Link>
      </div>
      
      <div className="flex flex-col gap-3">
        <h4 className="font-label-md text-label-md text-primary dark:text-white font-semibold mb-2">Connect</h4>
        <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors" to="#">Instagram</Link>
        <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors" to="#">Twitter</Link>
        <div className="mt-2">
          <h4 className="font-label-md text-label-md text-primary dark:text-white font-semibold mb-2">Newsletter</h4>
          <div className="flex gap-2">
            <input className="bg-surface dark:bg-[#1a1c1c] border border-outline-variant dark:border-gray-800 rounded-lg px-3 py-2 text-label-sm dark:text-white w-full focus:outline-none focus:border-primary" placeholder="Enter your email" type="email" />
            <button className="bg-primary text-on-primary rounded-lg px-3 py-2 flex items-center justify-center hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
