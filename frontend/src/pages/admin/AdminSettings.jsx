import React, { useState } from 'react';
import toast from '../../components/dashboard/Toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
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
        <h2 className="font-headline-xl text-headline-xl text-primary-fixed mb-2">Platform Settings</h2>
        <p className="text-on-primary-container font-body-md text-body-md">Configure global platform rules and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar">
            {[
              { id: 'general', label: 'General', icon: 'settings' },
              { id: 'commission', label: 'Commissions', icon: 'payments' },
              { id: 'security', label: 'Security', icon: 'security' },
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
          
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="space-y-6 animate-reveal">
              <h3 className="font-headline-lg text-lg text-white mb-6">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-label-md text-on-primary-container mb-2">Platform Name</label>
                  <input type="text" defaultValue="Aura Eats" className="w-full bg-[#141b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-fixed focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-label-md text-on-primary-container mb-2">Support Email</label>
                  <input type="email" defaultValue="support@auraeats.com" className="w-full bg-[#141b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-fixed focus:outline-none" />
                </div>
                
                <div className="md:col-span-2 mt-4">
                  <h4 className="font-label-md text-white mb-4 border-b border-white/5 pb-2">Platform Features</h4>
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-primary-fixed" />
                      <div>
                        <p className="font-label-md text-white">Allow New Vendor Registrations</p>
                        <p className="text-xs text-on-primary-container">Vendors can sign up via the portal.</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-primary-fixed" />
                      <div>
                        <p className="font-label-md text-white">Enable Customer Reviews</p>
                        <p className="text-xs text-on-primary-container">Customers can rate orders after delivery.</p>
                      </div>
                    </label>
                  </div>
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

          {activeTab === 'commission' && (
            <div className="space-y-6 animate-reveal">
              <h3 className="font-headline-lg text-lg text-white mb-6">Commission & Fees</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-label-md text-on-primary-container mb-2">Standard Platform Fee (%)</label>
                  <input type="number" defaultValue="15" className="w-full bg-[#141b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-fixed focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-label-md text-on-primary-container mb-2">Tax Rate (%)</label>
                  <input type="number" defaultValue="5" className="w-full bg-[#141b2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-fixed focus:outline-none font-mono" />
                </div>
              </div>
              
              <div className="flex justify-end pt-4 mt-6 border-t border-white/5">
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-white text-black rounded-xl font-label-md hover:bg-gray-200 transition-colors">
                  Update Fees
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="py-12 text-center text-on-primary-container animate-reveal">
              <span className="material-symbols-outlined text-[48px] mb-4">admin_panel_settings</span>
              <h3 className="font-headline-lg text-white mb-2">Advanced Security</h3>
              <p>Manage API keys and 2FA policies.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
