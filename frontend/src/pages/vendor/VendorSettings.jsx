import React, { useState } from 'react';
import toast from '../../components/dashboard/Toast';

const VendorSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success('Settings saved successfully');
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-white/5">
        <h2 className="font-headline-xl text-headline-xl text-white mb-2">Settings</h2>
        <p className="text-on-primary-container font-body-md text-body-md">Manage your restaurant profile and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar">
            {[
              { id: 'profile', label: 'Restaurant Profile', icon: 'storefront' },
              { id: 'hours', label: 'Operating Hours', icon: 'schedule' },
              { id: 'payouts', label: 'Payout Details', icon: 'account_balance' },
              { id: 'notifications', label: 'Notifications', icon: 'notifications' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md transition-all whitespace-nowrap text-left
                  ${activeTab === tab.id 
                    ? 'bg-white text-black' 
                    : 'text-on-primary-container hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
          
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-6 animate-reveal">
              <h3 className="font-headline-lg text-lg text-white mb-6">Restaurant Profile</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                  <span className="material-symbols-outlined text-[40px] text-on-primary-container">store</span>
                </div>
                <div>
                  <button type="button" className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-label-md text-white hover:bg-white/20 transition-colors mb-2 block">
                    Change Logo
                  </button>
                  <p className="text-xs text-on-primary-container">Recommended size: 512x512px</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-label-md text-on-primary-container mb-2">Restaurant Name</label>
                  <input type="text" defaultValue="Aura Eats Premium" className="w-full bg-[#141b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-label-md text-on-primary-container mb-2">Contact Number</label>
                  <input type="text" defaultValue="+91 9876543210" className="w-full bg-[#141b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-label-md text-on-primary-container mb-2">Business Address</label>
                  <input type="text" defaultValue="123 Food Street, Culinary District, Delhi" className="w-full bg-[#141b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-label-md text-on-primary-container mb-2">Description</label>
                  <textarea rows={3} defaultValue="Premium fast food and beverages." className="w-full bg-[#141b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#dce2f7] focus:outline-none resize-none" />
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-white text-black rounded-xl font-label-md hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-6 animate-reveal">
              <h3 className="font-headline-lg text-lg text-white mb-6">Operating Hours</h3>
              <p className="text-sm text-on-primary-container mb-6">Set the hours when your store is open for receiving orders.</p>
              
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <div key={day} className="flex items-center justify-between p-4 bg-[#141b2b] rounded-xl border border-white/5">
                    <div className="flex items-center gap-4 w-32">
                      <input type="checkbox" defaultChecked={day !== 'Sunday'} className="w-4 h-4 rounded accent-primary-fixed" />
                      <span className="font-label-md text-white">{day}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-1 max-w-xs">
                      <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none w-24">
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                      </select>
                      <span className="text-on-primary-container">to</span>
                      <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none w-24">
                        <option value="21:00" selected>09:00 PM</option>
                        <option value="22:00">10:00 PM</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4 mt-6 border-t border-white/5">
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-white text-black rounded-xl font-label-md hover:bg-gray-200 transition-colors">
                  Save Hours
                </button>
              </div>
            </div>
          )}

          {(activeTab === 'payouts' || activeTab === 'notifications') && (
            <div className="py-12 text-center text-on-primary-container animate-reveal">
              <span className="material-symbols-outlined text-[48px] mb-4">construction</span>
              <h3 className="font-headline-lg text-white mb-2">Coming Soon</h3>
              <p>This settings section is currently under development.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VendorSettings;
