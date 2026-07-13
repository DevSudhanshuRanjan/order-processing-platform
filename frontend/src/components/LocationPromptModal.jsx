import { useLocation } from '../contexts/LocationContext';

const LocationPromptModal = ({ onClose }) => {
  const { getCurrentLocation, loading } = useLocation();

  const handleAllow = () => {
    getCurrentLocation();
    onClose();
  };

  const handleDeny = () => {
    // Mark as denied so we show the "Check" button instead
    localStorage.setItem('aura_location_denied', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest dark:bg-[#121414] rounded-3xl max-w-md w-full soft-shadow border border-outline-variant/30 dark:border-gray-800 overflow-hidden animate-scale-in">
        {/* Modal Header with Illustration */}
        <div className="relative h-40 bg-gradient-to-br from-[#F97316]/20 to-orange-600/10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #F97316 1px, transparent 0)", backgroundSize: "20px 20px" }} />
          <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-[#F97316] to-orange-600 flex items-center justify-center shadow-lg shadow-[#F97316]/30">
            <span className="material-symbols-outlined text-white text-3xl icon-fill">my_location</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 text-center">
          <h2 className="font-headline-xl text-headline-xl text-primary dark:text-white mb-2">
            Enable Location
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Allow location access to check if we can deliver to your area and show you the most relevant menu items.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-col gap-3 mb-6 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container dark:bg-gray-800/50">
              <div className="w-9 h-9 rounded-lg bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#F97316] text-lg">check_circle</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-primary dark:text-white">Delivery Check</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">See if we deliver to your address</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container dark:bg-gray-800/50">
              <div className="w-9 h-9 rounded-lg bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#F97316] text-lg">schedule</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-primary dark:text-white">Accurate ETA</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Get precise delivery time estimates</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAllow}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#F97316] text-white font-label-md text-label-md hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-[#F97316]/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Locating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">my_location</span>
                  Allow Location Access
                </>
              )}
            </button>
            <button
              onClick={handleDeny}
              className="w-full py-3 rounded-xl bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 font-label-md text-label-md hover:bg-surface-container-high dark:hover:bg-gray-700 transition-colors"
            >
              Not right now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPromptModal;