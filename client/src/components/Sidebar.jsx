import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import { 
  LayoutDashboard, 
  PenTool, 
  Type, 
  Image as ImageIcon, 
  Scissors, 
  Eraser, 
  FileText, 
  LogOut, 
  Users,
  Sparkles,
  Moon,
  Sun,
  Zap
} from 'lucide-react'

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme')) return localStorage.getItem('theme');
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Toggle Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Trigger entrance animations
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { to: '/ai', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/ai/write-article', label: 'Write Article', icon: PenTool },
    { to: '/ai/blog-titles', label: 'Blog Titles', icon: Type },
    { to: '/ai/generate-images', label: 'Generate Images', icon: ImageIcon },
    { to: '/ai/remove-background', label: 'Remove Background', icon: Scissors },
    { to: '/ai/remove-object', label: 'Remove Object', icon: Eraser },
    { to: '/ai/review-resume', label: 'Review Resume', icon: FileText },
    { to: '/ai/Community', label: 'Community', icon: Users },
  ];

  const handleSignOut = async () => {
    await signOut(() => navigate('/'));
  };

  return (
    <>
      {/* --- ANIMATION STYLES --- */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-enter {
          animation: slideIn 0.4s ease-out forwards;
          opacity: 0;
        }
        .text-shimmer {
          background: linear-gradient(90deg, #4f46e5 0%, #a855f7 50%, #4f46e5 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- MOBILE OVERLAY --- */}
      {sidebar && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 sm:hidden transition-all duration-500"
          onClick={() => setSidebar(false)}
        />
      )}

      <div 
        className={`
          w-72 bg-white/80 dark:bg-[#0B0F19]/90 backdrop-blur-2xl border-r border-white/20 dark:border-white/5 flex flex-col 
          fixed sm:relative top-16 sm:top-0 h-[calc(100vh-64px)] z-40 
          transition-all duration-500 ease-in-out shadow-2xl shadow-indigo-500/10
          ${sidebar ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        `}
      >
        
        {/* --- DECORATIVE BLUR ORB --- */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* --- MENU ITEMS --- */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-3 no-scrollbar relative z-10">
            
            {/* Section Header & Theme Toggle */}
            <div className="flex items-center justify-between px-4 mb-4">
                <div className="flex items-center gap-2 opacity-50 text-xs font-bold uppercase tracking-widest text-indigo-900 dark:text-indigo-200">
                    <Sparkles size={12} className="text-purple-500" /> AI Suite
                </div>
                
                {/* 🌙 Theme Toggle Button */}
                <button 
                    onClick={toggleTheme}
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:text-indigo-600 transition-all shadow-sm"
                >
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                </button>
            </div>

            {navItems.map((item, index) => (
                <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebar(false)}
                style={{ animationDelay: `${index * 50}ms` }} 
                className={({ isActive }) => `
                    animate-enter group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium overflow-hidden
                    ${isActive 
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 shadow-lg shadow-indigo-500/5 translate-x-1' 
                    : 'hover:bg-gray-50 dark:hover:bg-white/5 hover:translate-x-1'}
                `}
                >
                {({ isActive }) => (
                    <>
                    {/* Active Indicator */}
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full" />
                    )}

                    {/* Icon */}
                    <div className={`
                        p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                        ${isActive 
                            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300' 
                            : 'bg-gray-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-white/10 group-hover:shadow-sm'}
                    `}>
                        <item.icon className="w-5 h-5" />
                    </div>

                    {/* Text */}
                    <span className={`tracking-wide transition-all duration-300 ${isActive ? 'text-shimmer font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                        {item.label}
                    </span>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </>
                )}
                </NavLink>
            ))}
        </div>

        {/* --- USER PROFILE (Floating Card) --- */}
        <div className="p-4 relative z-10">
            <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/30 to-purple-500/30">
                <div className="bg-white/90 dark:bg-[#151b2b]/90 backdrop-blur-xl rounded-2xl p-4">
                    
                    {/* Profile Row */}
                    <div 
                        className="flex items-center gap-3 mb-4 cursor-pointer group"
                        onClick={() => openUserProfile()}
                    >
                        <div className="relative">
                            <img 
                                src={user?.imageUrl} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-white/10 group-hover:ring-indigo-300 transition-all duration-300" 
                            />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#151b2b] rounded-full animate-pulse"></span>
                        </div>
                        
                        <div className="overflow-hidden flex-1">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                                {user?.fullName || 'User'}
                            </h3>
                            
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                                    Free
                                </span>
                                
                                {/* 🔥 UPGRADE BUTTON */}
                                <button className="flex items-center gap-1 text-[9px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-md shadow-sm hover:scale-105 transition-transform animate-pulse">
                                    <Zap size={10} fill="currentColor" /> UPGRADE
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sign Out Button */}
                    <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-300 group"
                    >
                        <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>

                </div>
            </div>
        </div>

      </div>
    </>
  )
}

export default Sidebar