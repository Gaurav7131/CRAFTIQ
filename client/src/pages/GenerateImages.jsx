import React, { useState } from "react";
import { Image as ImageIcon, Sparkles, Loader2, Download, Wand2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyles = [
    "Realistic", "Ghibli style", "Anime style", 
    "Cartoon style", "Fantasy style", "3D style", "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // mapped to 'content' in your original

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setImageUrl(data.imageUrl || data.content); // adjusts to your API response key
        toast.success("Masterpiece created!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <div className='absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-10 -translate-y-10'></div>

          <div className='flex items-center gap-4 mb-8'>
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className='w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-200'
            >
              <Sparkles className='w-6 text-white' />
            </motion.div>
            <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>AI Image Generator</h1>
          </div>

          <div className='space-y-6'>
            <div>
                <label className='text-sm font-bold text-slate-700 ml-1 mb-2 block'>Describe your imagination</label>
                <textarea
                  rows={4}
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  className='w-full p-4 text-sm rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all resize-none shadow-sm'
                  placeholder='Describe what you want to see...'
                  required
                />
            </div>

            <div>
                <label className='text-sm font-bold text-slate-700 ml-1 mb-2 block'>Choose Style</label>
                <div className='flex flex-wrap gap-2'>
                    {imageStyles.map((style) => (
                        <motion.button
                            key={style}
                            type="button"
                            onClick={() => setSelectedStyle(style)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`text-xs px-4 py-2 rounded-full font-bold transition-all border ${
                                selectedStyle === style 
                                ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200' 
                                : 'bg-white text-slate-500 border-gray-200 hover:border-green-300 hover:bg-green-50'
                            }`}
                        >
                            {style}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Public Toggle */}
            <div className="flex items-center gap-3 p-1">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <span className="text-sm font-medium text-slate-600">Make this image public</span>
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full flex justify-center items-center gap-2 text-white px-6 py-5 mt-8 text-base font-bold tracking-wide rounded-2xl overflow-hidden shadow-xl shadow-green-500/30 transition-all group
               ${loading ? 'bg-green-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-[length:200%_auto]'}
            `}
            animate={!loading ? { backgroundPosition: ["0% 50%", "100% 50%"] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
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
                <ImageIcon className='w-4 h-4 text-green-500' /> Result
            </h2>
            {imageUrl && (
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={imageUrl} 
                  download 
                  target="_blank" 
                  className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors'
                >
                    <Download className='w-4 h-4' />
                </motion.a>
            )}
          </div>

          <div className='flex-1 flex items-center justify-center p-6 bg-slate-50/50 relative'>
            <AnimatePresence mode='wait'>
              {!imageUrl ? (
                <motion.div
                  key="placeholder"
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
                  key="result-image"
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
  );
};

export default GenerateImages;