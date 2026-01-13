import React from 'react';

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background: linear-gradient(90deg, #4F46E5, #9333EA, #3B82F6);
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <footer className="font-jakarta px-6 md:px-16 lg:px-24 xl:px-32 w-full text-slate-600 bg-[#F8FAFC] pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6 group cursor-pointer">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold tracking-tight animate-gradient">
                CRAFTIQ
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              CRAFTIQ is a free and open-source UI component library with over 300+ beautifully crafted, customizable components built with Tailwind CSS.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="flex flex-col space-y-4">
            <h2 className="font-bold text-slate-900 mb-2">Company</h2>
            {['About us', 'Careers', 'Contact us', 'Privacy policy'].map((item) => (
              <a key={item} href="#" className="text-sm hover:text-indigo-600 transition-colors flex items-center gap-2">
                {item}
                {item === 'Careers' && (
                  <span className="text-[10px] font-bold text-white bg-indigo-600 rounded-full px-2 py-0.5 animate-pulse">
                    Hiring!
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="flex flex-col space-y-4">
            <h2 className="font-bold text-slate-900 mb-2">Product</h2>
            {['Components', 'Themes', 'Templates', 'Pricing'].map((item) => (
              <a key={item} href="#" className="text-sm hover:text-indigo-600 transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-3 text-sm">Subscribe to our newsletter</h2>
            <p className="text-xs text-slate-500 mb-4">The latest news and resources, sent weekly.</p>
            <div className="space-y-2">
              <input 
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                type="email" 
                placeholder="Enter email" 
              />
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-md shadow-indigo-100">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-center items-center text-xs text-slate-400">
          <p>Copyright {new Date().getFullYear()} © <span className="font-bold text-slate-600">CRAFTIQ</span> All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;