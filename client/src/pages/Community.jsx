import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { Heart, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post("/api/user/toggle-like-creation", { id }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        toast.success(data.message);
        // Optimized: Update local state instead of re-fetching everything to prevent flicker
        setCreations(prev => prev.map(c => 
          c._id === id || c.id === id ? { ...c, likes: data.likes } : c
        ));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className='flex-1 h-full flex flex-col p-6 bg-slate-50'>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center gap-3 mb-6'
      >
        <div className='p-2 bg-pink-100 rounded-lg'>
           <Sparkles className='w-6 h-6 text-pink-500' />
        </div>
        <h1 className='text-2xl font-bold text-slate-800'>Community Showcase</h1>
      </motion.div>

      {/* Main Content Area */}
      <div className='flex-1 overflow-y-scroll scrollbar-hide'>
        <AnimatePresence mode="wait">
          {!loading ? (
            creations.length > 0 ? (
              <motion.div 
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 pb-10'
              >
                {creations.map((creation, index) => (
                  <motion.div 
                    key={creation._id || creation.id || index} 
                    variants={itemVariants}
                    className='relative group break-inside-avoid rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300'
                  >
                    {/* Image */}
                    <img 
                      src={creation.content} 
                      alt="Community creation" 
                      loading="lazy"
                      className='w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out' 
                    />

                    {/* Overlay Gradient */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
                      
                      {/* Prompt Text (Slides Up) */}
                      <p className='text-white text-sm font-medium line-clamp-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 mb-3'>
                         {creation.prompt}
                      </p>

                      {/* Like Button Row */}
                      <div className='flex justify-between items-center w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100'>
                         <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full'>
                            <span className='text-xs font-semibold text-white'>{creation.likes?.length || 0} likes</span>
                         </div>
                         
                         <motion.button 
                           whileHover={{ scale: 1.2 }}
                           whileTap={{ scale: 0.8 }}
                           onClick={(e) => {
                               e.stopPropagation();
                               imageLikeToggle(creation._id || creation.id);
                           }}
                           className='p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors'
                         >
                            <Heart 
                               className={`w-5 h-5 transition-colors duration-300 ${
                                 creation.likes?.includes(user?.id) 
                                 ? 'fill-rose-500 text-rose-500' 
                                 : 'text-white hover:text-rose-200'
                               }`}
                            />
                         </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className='h-full flex flex-col items-center justify-center text-slate-400 gap-4'
              >
                 <ImageIcon className='w-16 h-16 opacity-20' />
                 <p>No published creations yet. Be the first to share!</p>
              </motion.div>
            )
          ) : (
            /* Loading State */
            <motion.div 
              key="loading"
              exit={{ opacity: 0 }}
              className='h-full flex flex-col items-center justify-center gap-4'
            >
              <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                 <Loader2 className='w-10 h-10 text-pink-500' />
              </motion.div>
              <p className='text-slate-500 font-medium animate-pulse'>Loading inspiration...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Community;