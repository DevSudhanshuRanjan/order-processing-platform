import { useCart } from '../contexts/CartContext';

const VendorSwitchModal = () => {
  const { vendorConflict, handleSwitchVendor, handleCancelSwitchVendor } = useCart();

  if (!vendorConflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest dark:bg-[#121414] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-outline-variant/30 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#F97316]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#F97316] text-3xl">restaurant_change</span>
          </div>
          
          <h3 className="font-headline-md text-headline-md text-primary dark:text-white">
            Switch Restaurant?
          </h3>
          
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400">
            Your cart currently contains items from another restaurant. Would you like to clear your current cart and add items from this new restaurant instead?
          </p>

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={handleCancelSwitchVendor}
              className="flex-1 py-3 rounded-xl font-label-md text-label-md border border-outline-variant dark:border-gray-700 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSwitchVendor}
              className="flex-1 py-3 rounded-xl font-label-md text-label-md bg-[#F97316] text-white hover:bg-[#F97316]/90 transition-colors shadow-md shadow-[#F97316]/20"
            >
              Switch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSwitchModal;