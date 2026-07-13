import { Link } from 'react-router-dom';
import MenuSection from '../components/MenuSection';
import HeroDashboard from '../components/HeroDashboard';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-[#1a1c1c]">
      {/* Hero Section - Widget Dashboard */}
      <HeroDashboard />

      {/* Menu Section - Products embedded directly (SPA) */}
      <MenuSection />

      {/* Categories Section */}
      <section className="py-stack-lg bg-surface dark:bg-[#1a1c1c] px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-stack-md">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary dark:text-white">Explore Categories</h2>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mt-2">Find your cravings, elevated.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full border border-outline-variant dark:border-gray-700 flex items-center justify-center hover:bg-surface-container dark:hover:bg-gray-800 dark:text-gray-300 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button className="w-10 h-10 rounded-full border border-outline-variant dark:border-gray-700 flex items-center justify-center hover:bg-surface-container dark:hover:bg-gray-800 dark:text-gray-300 transition-colors">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          
          {/* Horizontal Scroll Container */}
          <div className="flex overflow-x-auto gap-gutter pb-4 hide-scrollbar snap-x">
            <a href="#menu-section" className="min-w-[160px] md:min-w-[200px] flex flex-col gap-3 group snap-start">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden relative soft-shadow">
                <div 
                  className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-110 transition-transform duration-500" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJ9RviPD5riivksE2-QWg73pDt-XddMIkRM_GcOueaeN1WT_WESEXJXkFnB1qZB6iIrJuA1vqqLsBuNsa_UwSTvEhaSmef-CiBLfP6_wz2WPPZ73RNe-fNjc8YDBFQC1qhW3xhJmg1PInLmye-P5vLmFtXIIT5fZk2n0th6vrie6Z5dlabzW2zeuuaCip8H9LWhxVTdSaVmNfV6wM5cvphQ680Aq6Jjg_8zBfj1Tj7L0SPkpGgKontNTD-UPUfj9RYCtyMWiXDN7g')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-center">
                <h3 className="font-label-md text-label-md text-primary dark:text-white group-hover:text-[#F97316] transition-colors">Burgers</h3>
              </div>
            </a>
            
            <a href="#menu-section" className="min-w-[160px] md:min-w-[200px] flex flex-col gap-3 group snap-start">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden relative soft-shadow">
                <div 
                  className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-110 transition-transform duration-500" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSxT-1zK7mjS80eVUS8-iW8iTQZqRjl7XrsuVhnHYsb8uF8c_RmQ-f5L7-GgVsOeCUS1Cgn-15ufVvAedwwtklm4kwZHF4fS39m-ibuOkM9f3r8DychPr5xWAEkYDzhk8Xs9Kk8Rk_pXlijEWb2TKgK4UfvcN3plM4z_kt9hykl3aeJmUiX9OHVZepoPC_jaZkqQ5H8qZtn1NIbRPEcSyqA4T5uu5mlYSqPu2E4m4W-OtMJsvkxhStL-aj3BghDEaseCZc4gfnGFk')" }}
                ></div>
              </div>
              <div className="text-center">
                <h3 className="font-label-md text-label-md text-primary dark:text-white group-hover:text-[#F97316] transition-colors">Pizza</h3>
              </div>
            </a>
            
            <a href="#menu-section" className="min-w-[160px] md:min-w-[200px] flex flex-col gap-3 group snap-start">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden relative soft-shadow">
                <div 
                  className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-110 transition-transform duration-500" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDyhnuLA8Up-tu5R0BxGJ_2RCrn7TZDqkhaWRQFlKp5hH8TEeiwRIMv0L6gZFg7nqqYdoVgV_Wqh1baGEiZxN9v2J4KZhqvdelR7nB87FJ1EN5iKVO6g7KC5urW8j0p-W9_lA_qrCAv0jNOKGDQLA8bNvDMw98hEKOaR0RRoLfN41iGIg1dXLm5JXMsjXX1ZefWOq72QjQNE0v23WBPbGPSONS7BoabSj56SsrgH41U0qIc7lnDd8Itn0tPPnpgCWFc2WiG_Nxvjd8')" }}
                ></div>
              </div>
              <div className="text-center">
                <h3 className="font-label-md text-label-md text-primary dark:text-white group-hover:text-[#F97316] transition-colors">Chinese</h3>
              </div>
            </a>
            
            <a href="#menu-section" className="min-w-[160px] md:min-w-[200px] flex flex-col gap-3 group snap-start">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden relative soft-shadow">
                <div 
                  className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-110 transition-transform duration-500" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5qBNQDiRiCbJ6Ndxq3cpS8Iv1-82wKiJXCYBYSeowYJjshLSnu0duqfBCXMFzrJChxEBnQi3JkOren9WvsOkW9jltBQxnP8QywHlbnlEGf6HHGrnr4qDtgqf7i9MZQdK-o_dBUKO-9o-YSejJQsj74N392YeFwZhDtvD_IUToFnTAR_RhvhjitO0BXm6nQ6UGG-8mfoEAUyNKQxk8fpDyNdYLJh68OAPvF_oYnsFH7hOnTs9tYxzXz3urezyvEnv47rbYMgp7vu0')" }}
                ></div>
              </div>
              <div className="text-center">
                <h3 className="font-label-md text-label-md text-primary dark:text-white group-hover:text-[#F97316] transition-colors">Dessert</h3>
              </div>
            </a>
            
            <a href="#menu-section" className="min-w-[160px] md:min-w-[200px] flex flex-col gap-3 group snap-start">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden relative soft-shadow">
                <div 
                  className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-110 transition-transform duration-500" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzmGJx4fMeMuhiloVeIstycwSjhqlVeqCUB1FmPjTMvMB0cRZCdkqfj7-Mi5iWlf6OCZ_091xwaUJxITJbhJ-TFYgUyqF0-30nT2Va57DLh09hT-TdV_KoN1R8Xz0dWm1qw6i6bQf51I_-sLelXTWn-D7whCRJyRyg8LtEis3fCybLFgu_5FJNJ3RfJhM97NkwAlkO-Xb_wLSMC3xGA0L5JdRZweJdjSNZQLzmR-ArEBEum3KZzuVqljcWo_m3sEeFqGOkyarrHMw')" }}
                ></div>
              </div>
              <div className="text-center">
                <h3 className="font-label-md text-label-md text-primary dark:text-white group-hover:text-[#F97316] transition-colors">Drinks</h3>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Popular Offerings */}
      <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-stack-md">
          <h2 className="font-headline-xl text-headline-xl text-primary dark:text-white">Popular Offerings</h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 mt-2 max-w-lg mx-auto">Curated favorites chosen by our discerning community.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {/* Product Card 1 */}
          <div className="bg-surface-container-lowest dark:bg-[#121414] rounded-[24px] p-4 soft-shadow border border-outline-variant/30 dark:border-gray-800 group hover:-translate-y-1 transition-transform duration-300">
            <div className="relative h-64 rounded-[16px] overflow-hidden mb-4">
              <div 
                className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-500" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBS9rbUr_8TcDA3w8fTcXJqIM5TA1pmtQbKGDcQ-QvIleWPFJLA9eA_lgrn5G4F0Acaj68DPbtL-Wcvy3XmH1mMUPrlmlThevnbLQ5Sr52NyPNWHHJoNZAgckyd0vwoZJn7H_uw_9N6ByKzURLjK6kaZwwK0EaAHijScqQ7ZWzN1dPYn8ExnwjHlhncNyXCrDBRVPIA5rOY8kMDUwT67_592UeXwtGTcaU6dUpmXDrcH4AEKVgVRnwbtAYHRjClAyw549YFSmfM5Vc')" }}
              ></div>
              <div className="absolute top-3 left-3 bg-surface-container-lowest/90 dark:bg-[#121414]/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#F97316] icon-fill">star</span>
                <span className="font-label-sm text-label-sm font-bold">4.9</span>
              </div>
              <button className="absolute top-3 right-3 w-10 h-10 bg-surface-container-lowest/90 dark:bg-[#121414]/90 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface-variant dark:text-gray-400 hover:text-[#ba1a1a] transition-colors">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h3 className="font-headline-lg text-headline-lg-mobile text-primary dark:text-white">Truffle Wagyu Burger</h3>
                <span className="font-headline-lg text-headline-lg-mobile text-primary dark:text-white">$24</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 line-clamp-2">Premium wagyu patty, black truffle aioli, aged cheddar, arugula on a brioche bun.</p>
              <a href="#menu-section" className="mt-4 w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <span>Add to Cart</span>
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </a>
            </div>
          </div>
          
          {/* Product Card 2 */}
          <div className="bg-surface-container-lowest dark:bg-[#121414] rounded-[24px] p-4 soft-shadow border border-outline-variant/30 dark:border-gray-800 group hover:-translate-y-1 transition-transform duration-300">
            <div className="relative h-64 rounded-[16px] overflow-hidden mb-4">
              <div 
                className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-500" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkG1fbAsUTJH4osWnJuvs-aod65pGGRip4EhgvlKIo84y1Vf3aIyF3YFczleQ5t8K75RgZx8sqK4AK1c6tP2R1auaML-qPOr_A32ObiFTXDg_x8AxxHMkcexlIi_jdwedHQBpI24txhMVwm3JzOMCD2uTG-yXZrYcjLGlJkSaN-GqaTkCB6k6U--v7c5LG__imjl57ZL8LoLtqfJY3cFtyRKFZeGnljc09abNY-hhPzn3UJ8sZ-Qsjo7SWcUldN8RM8vk1LghmXp0')" }}
              ></div>
              <div className="absolute top-3 left-3 bg-surface-container-lowest/90 dark:bg-[#121414]/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#F97316] icon-fill">star</span>
                <span className="font-label-sm text-label-sm font-bold dark:text-white">4.8</span>
              </div>
              <button className="absolute top-3 right-3 w-10 h-10 bg-surface-container-lowest/90 dark:bg-[#121414]/90 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface-variant dark:text-gray-400 hover:text-[#ba1a1a] transition-colors">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h3 className="font-headline-lg text-headline-lg-mobile text-primary dark:text-white">Artisan Margherita</h3>
                <span className="font-headline-lg text-headline-lg-mobile text-primary dark:text-white">$18</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 line-clamp-2">San Marzano tomatoes, fresh mozzarella di bufala, basil, extra virgin olive oil.</p>
              <a href="#menu-section" className="mt-4 w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <span>Add to Cart</span>
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </a>
            </div>
          </div>
          
          {/* Product Card 3 */}
          <div className="bg-surface-container-lowest dark:bg-[#121414] rounded-[24px] p-4 soft-shadow border border-outline-variant/30 dark:border-gray-800 group hover:-translate-y-1 transition-transform duration-300">
            <div className="relative h-64 rounded-[16px] overflow-hidden mb-4">
              <div 
                className="absolute inset-0 bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-500" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVI1CDZ4DmUtSEBHW4KcWZl1M-VFnMsDae8n3w-gmWTiNgCGFLR6SVKh90DHOv18ECL9K-63xExl0LOyeBFRz_AG3KDozLBc5294H6V7GS50t5n0OQ5xR552dnJ5AT-PEHvbgS97A_jsAjnNCprG1X6idDpWQ9UZ4U1YKrOd_e3y6RvDby9aokCHfxfmqg1sBrsxbCY-FxFJQMjtMaDoNMhVj_CZ7YEC5Lv2KJ0yp52WYsSz6-kIiGyGEiRlTc9a3gYWQ4YEIt6iY')" }}
              ></div>
              <div className="absolute top-3 left-3 bg-surface-container-lowest/90 dark:bg-[#121414]/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#F97316] icon-fill">star</span>
                <span className="font-label-sm text-label-sm font-bold dark:text-white">4.9</span>
              </div>
              <button className="absolute top-3 right-3 w-10 h-10 bg-surface-container-lowest/90 dark:bg-[#121414]/90 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface-variant dark:text-gray-400 hover:text-[#ba1a1a] transition-colors">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h3 className="font-headline-lg text-headline-lg-mobile text-primary dark:text-white">Pacific Salmon Poke</h3>
                <span className="font-headline-lg text-headline-lg-mobile text-primary dark:text-white">$21</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 line-clamp-2">Fresh Atlantic salmon, sushi rice, avocado, edamame, ponzu dressing, sesame.</p>
              <a href="#menu-section" className="mt-4 w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <span>Add to Cart</span>
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-stack-lg bg-surface-container-low dark:bg-[#1a1c1c] px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-stack-md">
            <h2 className="font-headline-xl text-headline-xl text-primary dark:text-white">Aura Experiences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Testimonial 1 */}
            <div className="bg-surface-container-lowest dark:bg-[#121414] p-6 rounded-2xl soft-shadow flex flex-col gap-4 border border-transparent dark:border-gray-800 transition-colors">
              <div className="flex text-[#F97316]">
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300 italic">"The packaging alone feels like a luxury unboxing experience. The food arrived perfectly hot and beautifully presented. Aura Eats has ruined regular takeout for me."</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-outline-variant/30 dark:border-gray-800">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuANZz1EAJrNSYBxDhn4CKwlQFb9pTJEAz1DUegn63IjcV46qUAQrcSeA0vaO1GTZfB61EJ2WXoOAjz-duSp1PCMTyOe9YAFuy0jm663TSbTbgbDUPuVatpdMMzV3foZ81SuzrBL8TBkZagTAQ6zoTT8CXw1bA20y2WlAxCWRCc9Fonaq8h_kw0W_Hq7ZAOmeKC8-YdX9eYqe6aZxzT7AzdM58IZY2xEns5DAy665CwxmQipwIkviyeIabU1mHaKe40_K_NWB8hWK5o" alt="Sarah Jenkins" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-label-md text-label-md text-primary dark:text-white">Sarah Jenkins</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Food Critic</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-surface-container-lowest dark:bg-[#121414] p-6 rounded-2xl soft-shadow flex flex-col gap-4 border border-transparent dark:border-gray-800 transition-colors">
              <div className="flex text-[#F97316]">
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300 italic">"Incredible attention to detail. The Wagyu burger was cooked to a perfect medium-rare, even after a 20-minute delivery. Highly recommend for date nights in."</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-outline-variant/30 dark:border-gray-800">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaCOwKLi4KN3vuBRm6vw21IlLXANVShTz8Q3kEsT9Z_i-EPLpDdtu5Bb9rOeuCtc5nYaY5JwgEGZgWjkV8mPR4AMD-3kvgVhD-gXxACoqFCTFr9FK2l9WASOsqSyzkxoPtiBS7ZfVHwUhiQeNY89rj6hhmrPeYC5TTzTEy_WAQzN5JPrJnPosowEsrjV4HU7hYCVxp_8XBgTRxIN6maE-dqdLXmbCjRL-nlb3U0cmVEsLkPF7zKVcP342GgHcLcVxwWu0lnP-d0ok" alt="David Chen" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-label-md text-label-md text-primary dark:text-white">David Chen</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Regular Customer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-surface-container-lowest dark:bg-[#121414] p-6 rounded-2xl soft-shadow flex flex-col gap-4 border border-transparent dark:border-gray-800 transition-colors">
              <div className="flex text-[#F97316]">
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star</span>
                <span className="material-symbols-outlined text-sm icon-fill">star_half</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300 italic">"Finally, a delivery service that respects the food. The interface is clean, delivery is fast, and the quality of the partner restaurants is unmatched."</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-outline-variant/30 dark:border-gray-800">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnWl3p0dm06Hn7En0RlNtc_FeeeKyofqc_RKFMbMu4raVNtMdDIH4HbpZTKakK6WQpBkvGoMOtFjjjROAFfeg6PIZ8-njQXBa1qvtmxQkJtbti5bTqctzIJdiU1GHiPBc73w5GZ8ClZGxNzhxy0uTQNgHerByCLfa97tXvGRByjDlwTyXzchbb0IbBDk25qVAQ-TuZS6bGwY6Ci9gTjZEiyIiJ5na1xIENKP5tvN7n_CcETadvOipRE4iUZLo2IDSpiDRRH76iJWg" alt="Elena Rodriguez" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-label-md text-label-md text-primary dark:text-white">Elena Rodriguez</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">Local Guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Luxury CTA Banner */}
      <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg">
        <div className="bg-primary text-on-primary rounded-[32px] overflow-hidden relative flex flex-col md:flex-row items-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
          
          <div className="p-8 md:p-16 flex-1 z-10 flex flex-col gap-stack-sm text-center md:text-left">
            <h2 className="font-headline-xl text-headline-xl text-on-primary">Elevate Your Evening.</h2>
            <p className="font-body-md text-body-md text-surface-dim dark:text-gray-300 max-w-md mx-auto md:mx-0">Join Aura Premium for zero delivery fees, priority preparation, and exclusive tasting menus from top chefs.</p>
            <div className="mt-4">
              <Link to="/register" className="bg-[#F97316] text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#F97316]/20 inline-block text-center">
                Join Aura Premium
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 h-64 md:h-full min-h-[300px] relative">
            <div 
              className="absolute inset-0 bg-cover bg-center w-full h-full" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCo1spbiqyJbUJcYXLoWJtW-ThJJscAHFmHoDHRrChnNdjYg81KZ4_GNae8fLN9td8LR2-P_qw4QZlkuYBzNPxxbPv9VC9PyF1dYEpR03vtSsM6BX7cxUNYvDeg51-31citAp7ZxNGzy9144yFOffwoe58o7TfreXbDzBbZxpqy9c_qjGPBPucjSrLLKZ1U6N_tSTnraRav7FztI0BjdRTJbuPiadFQBaF8oHaYGSjeyvjh5fyLU6shTIK1xMuoWHkapvTJjE2DsSQ')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
