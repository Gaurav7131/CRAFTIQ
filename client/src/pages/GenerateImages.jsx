import { Image as ImageIcon, Sparkles, Loader2, Download, Wand2 } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const resolutions = ['256x256', '512x512', '1024x1024'];
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState(resolutions[1]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/ai/generate-image', { prompt, resolution }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setImageUrl(data.imageUrl);
        toast.success("Masterpiece created!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-6 text-slate-700 bg-slate-50'>
      <div className='flex items-start flex-wrap gap-8 justify-center max-w-7xl mx-auto'>
        
        {/* INPUT CARD */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          onSubmit={onSubmitHandler}
          className='w-full max-w-lg p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-purple-100/50 relative overflow-hidden'
        >
          {/* Decorative background blob */}
          <div className='absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl -z-10 opacity-60 translate-x-10 -translate-y-10'></div>

          <div className='flex items-center gap-4 mb-8'>
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className='w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-200'
            >
              <ImageIcon className='w-6 text-white' />
            </motion.div>
            <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>AI Image Generator</h1>
          </div>

          <div className='space-y-6'>
            <div>
                <label className='text-sm font-bold text-slate-700 ml-1 mb-2 block'>Describe your imagination</label>
                <textarea
                  rows={4}
                  onChange={(e) => setPrompt(e.target.value)}
                  value={prompt}
                  className='w-full p-4 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all resize-none shadow-sm'
                  placeholder='A cyberpunk city with neon rain...'
                  required
                />
            </div>

            <div>
                <label className='text-sm font-bold text-slate-700 ml-1 mb-2 block'>Canvas Size</label>
                <div className='flex gap-3'>
                    {resolutions.map((res) => (
                        <motion.button
                            key={res}
                            type="button"
                            onClick={() => setResolution(res)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 text-xs py-3 rounded-xl font-bold transition-all border ${
                                resolution === res 
                                ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-200' 
                                : 'bg-white text-slate-500 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                            }`}
                        >
                            {res}
                        </motion.button>
                    ))}
                </div>
            </div>
          </div>

          {/* --- SUPER ANIMATED BUTTON --- */}
          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full flex justify-center items-center gap-2 text-white px-6 py-5 mt-8 text-base font-bold tracking-wide rounded-2xl overflow-hidden shadow-xl shadow-pink-500/30 transition-all group
               ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 bg-[length:200%_auto]'}
            `}
            animate={!loading ? { backgroundPosition: ["0% 50%", "100% 50%"] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            {/* Shimmer Overlay */}
            {!loading && (
              <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-150%] group-hover:animate-[shimmer_1s_infinite] group-hover:translate-x-[150%] transition-transform duration-1000" />
            )}
            
            <div className='relative z-10 flex items-center gap-2'>
              {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <Wand2 className='w-5 h-5 group-hover:rotate-12 transition-transform' />}
              {loading ? 'Painting...' : 'Generate Masterpiece'}
            </div>
          </motion.button>
        </motion.form>

        {/* OUTPUT CARD */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col min-h-[550px] overflow-hidden'
        >
          <div className='p-6 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm flex items-center justify-between'>
            <h2 className='font-bold text-slate-700 flex items-center gap-2'>
                <Sparkles className='w-4 h-4 text-pink-500' /> Result
            </h2>
            {imageUrl && (
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={imageUrl} 
                  download 
                  target="_blank" 
                  className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors'
                >
                    <Download className='w-4 h-4' />
                </motion.a>
            )}
          </div>

          <div className='flex-1 flex items-center justify-center p-6 bg-slate-50/50 relative'>
            <AnimatePresence mode='wait'>
              {!imageUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className='text-center'
                >
                    <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <ImageIcon className='w-8 h-8 text-gray-300' />
                    </div>
                    <p className='text-sm text-gray-400 font-medium'>Waiting for your prompt...</p>
                </motion.div>
              ) : (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                  src={imageUrl}
                  alt="Generated AI"
                  className='rounded-2xl shadow-2xl max-w-full max-h-[400px] object-contain ring-4 ring-white'
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GenerateImages