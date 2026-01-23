import { Layers, Zap, Loader2, UploadCloud, Download, Scissors } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setResultImage(null);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Upload an image!");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      const { data } = await axios.post('/api/ai/remove-background', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setResultImage(data.imageUrl);
        toast.success("Background vanished!");
      }
    } catch (error) { toast.error(error.message); }
    setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-6 text-slate-700 bg-slate-50'>
      <div className='flex items-start flex-wrap gap-8 justify-center max-w-7xl mx-auto'>
        
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onSubmit={onSubmitHandler}
          className='w-full max-w-lg p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-100/50'
        >
          <div className='flex items-center gap-4 mb-8'>
            <motion.div 
               animate={{ rotate: [0, -5, 5, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-200'
            >
              <Scissors className='w-6 text-white' />
            </motion.div>
            <h1 className='text-2xl font-bold text-slate-800'>Remove Background</h1>
          </div>

          <div className='space-y-4'>
            <label className='text-sm font-bold text-slate-700 ml-1'>Upload Photo</label>
            <motion.div 
              whileHover={{ scale: 1.01, borderColor: '#3b82f6' }}
              className='relative w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl bg-blue-50/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors'
            >
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                {preview ? (
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={preview} className="h-full w-full object-contain p-2" />
                ) : (
                    <div className='text-center p-4'>
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <UploadCloud className='w-10 h-10 text-blue-400 mx-auto mb-3' />
                        </motion.div>
                        <p className='text-sm text-slate-500 font-semibold'>Drop your image here</p>
                    </div>
                )}
            </motion.div>
          </div>

          {/* --- ANIMATED BUTTON --- */}
          <motion.button
            disabled={loading || !imageFile}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full relative flex justify-center items-center gap-2 text-white px-6 py-5 mt-8 text-base font-bold rounded-2xl shadow-xl shadow-blue-500/30 overflow-hidden
               ${(loading || !imageFile) ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto]'}
            `}
            animate={!loading && imageFile ? { backgroundPosition: ["0% 50%", "100% 50%"] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <Zap className='w-5 h-5 fill-yellow-300 text-yellow-300' />}
            <span className='z-10 relative'>{loading ? 'Processing...' : 'Remove Background'}</span>
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className='w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col min-h-[500px]'
        >
           <div className='p-5 border-b border-gray-100 flex justify-between items-center'>
            <h2 className='font-bold text-slate-700'>Transparent Result</h2>
            {resultImage && (
                <a href={resultImage} download className='text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1'>
                    <Download className='w-3 h-3' /> Save
                </a>
            )}
           </div>
           {/* Checkerboard Background for Transparency */}
          <div className='flex-1 flex items-center justify-center p-6 bg-[url("https://www.transparenttextures.com/patterns/stardust.png")] bg-slate-100 rounded-b-3xl'>
             <AnimatePresence mode='wait'>
                {resultImage ? (
                     <motion.img
                        key="result"
                        initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        src={resultImage} 
                        className="max-w-full max-h-[350px] object-contain drop-shadow-2xl" 
                     />
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-slate-400 text-sm font-medium'>
                        Processed image will appear here
                    </motion.div>
                )}
             </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RemoveBackground