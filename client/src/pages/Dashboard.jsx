import React, { useEffect, useState } from 'react'
import { Gem, Sparkles, Loader2, Info, Box } from 'lucide-react'; 
import CreationItem from '../components/CreationItem';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { user } = useUser(); 

  // --- PLAN LOGIC ---
  const userPlan = user?.unsafeMetadata?.plan || user?.publicMetadata?.plan || 'free';
  const isPremium = userPlan === 'premium';

  const getDashboardData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
    
  useEffect(() => {
    if (user) getDashboardData();
  }, [user]);

  return (
    <div className='h-full overflow-y-auto p-6 sm:p-8 scroll-smooth bg-[#FAF7FB]'>
      
      {/* --- ANIMATION STYLES --- */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        /* New: Flowing Gradient Animation */
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        /* New: Floating Icon Animation */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        /* New: Pulsing Scale Animation */
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }

        .animate-card {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-logo {
          animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 3s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="animate-card" style={{ animationDelay: '0ms' }}>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">{user?.firstName || 'Creator'}!</span> 👋
              </h1>
              <p className="text-slate-500 mt-2 text-lg">Here's an overview of your creative workspace.</p>
          </div>
          <div className="animate-logo hidden sm:flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 rotate-3 hover:rotate-6 transition-transform duration-300">
            <Box className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>

        {/* Info Banner */}
        <div 
          className="col-span-full animate-card" 
          style={{ animationDelay: '100ms' }}
        >
          <div className='flex items-start gap-4 bg-amber-50/80 border border-amber-100/80 p-5 rounded-2xl text-sm text-amber-800 shadow-sm'>
             <Info className="w-6 h-6 shrink-0 text-amber-500 mt-0.5" />
             <div>
                 <h4 className="font-bold text-amber-900 mb-1">Demo Limitations</h4>
                 <p className="leading-relaxed text-amber-700/80">
                 You have a maximum of 3 credits to explore premium features. These limitations are in place because the demo relies on free-tier APIs.
                 </p>
             </div>
          </div>
        </div>

        {/* 🌟 ANIMATED TOTAL CREATIONS CARD */}
        <div 
          className='animate-card flex justify-between items-center p-6 bg-white rounded-3xl border border-gray-100/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300'
          style={{ animationDelay: '200ms' }}
        >
          <div>
            <p className='text-sm font-bold uppercase tracking-wider text-slate-400 mb-2'>Total Creations</p>
            <h2 className='text-4xl font-black text-slate-800'>{creations.length}</h2>
          </div>
          
          {/* Animated Background + Pulsing Icon */}
          <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 animate-gradient-flow text-white flex justify-center items-center shadow-lg shadow-blue-200/50'>
            <Sparkles className='w-8 h-8 text-white animate-pulse-scale'/>
          </div>
        </div>

        {/* 💎 ANIMATED ACTIVE PLAN CARD */}
        <div 
          className='animate-card flex justify-between items-center p-6 bg-white rounded-3xl border border-gray-100/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300'
          style={{ animationDelay: '300ms' }}
        >
          <div>
            <p className='text-sm font-bold uppercase tracking-wider text-slate-400 mb-2'>Active Plan</p>
            <h2 className={`text-4xl font-black capitalize ${isPremium ? 'bg-linear-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent' : 'text-slate-800'}`}>
              {isPremium ? 'Premium' : 'Free'}
            </h2>
          </div>
          
          {/* Conditional Animation for Premium Users */}
          <div className={`
             w-16 h-16 rounded-2xl flex justify-center items-center shadow-lg transition-all duration-500
             ${isPremium 
                ? 'bg-gradient-to-br from-fuchsia-600 via-purple-500 to-pink-500 animate-gradient-flow shadow-purple-200/50 text-white' 
                : 'bg-slate-100 text-slate-400'}
          `}>
            {/* Floating Gem Icon */}
            <Gem className={`w-8 h-8 ${isPremium ? 'animate-float' : ''}`}/>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      {loading ? (
        <div className='flex flex-col items-center justify-center h-64 animate-pulse'>
          <Loader2 className='w-12 h-12 text-indigo-500 animate-spin mb-4' />
          <p className="text-slate-400 text-lg font-medium">Loading your workspace...</p>
        </div>
      ) : (
        <div 
            className='space-y-6 animate-card'
            style={{ animationDelay: '400ms' }}
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className='text-2xl font-bold text-slate-800'>Recent Creations</h3>
            <span className="text-sm font-bold text-slate-500 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                {creations.length} Items
            </span>
          </div>
          
          {creations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {creations.map((item, index) => (
                    <div 
                        key={item._id} 
                        className="animate-card" 
                        style={{ animationDelay: `${500 + (index * 50)}ms` }}
                    >
                        <CreationItem item={item}/>
                    </div>
                 ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Sparkles className="w-10 h-10 text-slate-300" />
                </div>
                <h4 className="text-xl font-bold text-slate-700 mb-2">No creations yet</h4>
                <p className="text-slate-500 text-base max-w-md text-center">
                    Your creative journey starts here. Use the AI tools from the sidebar to generate your first piece of content!
                </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard