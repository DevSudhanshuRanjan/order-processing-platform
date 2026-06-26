import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-background dark:bg-[#1a1c1c] text-on-background dark:text-white min-h-screen pt-32 pb-stack-lg flex flex-col items-center justify-center text-center px-gutter">
      <div className="w-24 h-24 bg-surface-container dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[48px] text-on-surface-variant dark:text-gray-400">explore_off</span>
      </div>
      <h1 className="font-headline-xl text-headline-xl text-primary dark:text-white mb-4">Page Not Found</h1>
      <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mb-8 max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-8 py-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:-translate-y-[2px] transition-transform shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">home</span>
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
