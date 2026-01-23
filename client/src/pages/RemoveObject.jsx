import { Eraser, Wand2, Loader2, Upload, ScanLine } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [imageFile, setImageFile] = useState(null);
  const [objectToEdit, setObjectToEdit] = useState('');
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
    if (!imageFile || !objectToEdit) return toast.error("Missing details!");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('prompt', objectToEdit);
      const { data } = await axios.post('/api/ai/remove-object', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setResultImage(data.imageUrl);
        toast.success("Object erased!");
      }
    } catch (error) { toast.error(error.message); }
    setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-6 text-slate-700 bg-slate-50'>
      <div className='flex items-start flex-wrap gap-8 justify-center max-w-7xl mx-auto'>
        
        <motion.form
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          onSubmit={onSubmitHandler}
          className='w-full max-w-lg p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-orange-100/50'
        >
          <div className='flex items-center gap-4 mb-8'>
            <div className='w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200'>
              <Eraser className='w-6 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-slate-800'>Magic Eraser</h1>
          </div>

          <div className='space-y-6'>
            {/* Step 1 */}
            <div className='group'>
                <label className='flex items-center gap-2 text-sm font-bold text-slate-700 mb-2'>
                    <span className='bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs'>Step 1</span> Upload Image
                </label>
                <div className='relative w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl bg-orange-50/20 group-hover:bg-orange-50/50 transition-colors flex items-center justify-center overflow-hidden'>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {preview ? (
                        <img src={preview} className="h-full w-full object-cover opacity-90" />
                    ) : (
                        <div className='flex flex-col items-center text-orange-300'>
                            <Upload className='w-8 h-8 mb-1' />
                            <span className='text-xs font-semibold'>Select Image</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Step 2 */}
            <div>
                 <label className='flex items-center gap-2 text-sm font-bold text-slate-700 mb-2'>
                    <span className='bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs'>Step 2</span> What to remove?
                </label>
                <input
                  type="text"
                  onChange={(e) => setObjectToEdit(e.target.value)}
                  value={objectToEdit}
                  className='w-full p-4 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all shadow-sm'
                  placeholder='e.g., The red car on the left...'
                  required
                />
            </div>
          </div>

          {/* --- ANIMATED BUTTON --- */}
          <motion.button
            disabled={loading || !imageFile}
            whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px rgba(249, 115, 22, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center items-center gap-2 text-white px-6 py-5 mt-8 text-base font-bold rounded-2xl transition-all relative overflow-hidden
               ${(loading || !imageFile) ? 'bg-orange-300 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500'}
            `}
          >
            {/* Pulse Effect circle behind text */}
            {!loading && imageFile && (
                 <motion.div 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                 />
            )}

            {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <Wand2 className='w-5 h-5' />}
            <span className='relative z-10'>{loading ? 'Magic in progress...' : 'Erase Object'}</span>
          </motion.button>
        </motion.form>

        {/* COMPARISON SLIDER EFFECT (Simulated) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className='w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col min-h-[500px] overflow-hidden'
        >
          <div className='p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2'>
             <ScanLine className='w-4 h-4 text-orange-500' />
             <h2 className='font-bold text-slate-700'>Before & After</h2>
          </div>
          
          <div className='flex-1 p-6 flex flex-col gap-4 bg-slate-50'>
             {/* Original */}
             <motion.div 
                layout 
                className='flex-1 relative rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white'
             >
                <div className='absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider'>Original</div>
                {preview ? <img src={preview} className='h-full w-full object-cover' /> : <div className='h-full flex items-center justify-center text-slate-300 text-xs'>Empty</div>}
             </motion.div>

             {/* Result */}
             <motion.div 
                layout
                className='flex-1 relative rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white'
             >
                <div className='absolute top-3 left-3 z-10 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider'>Cleaned</div>
                {resultImage ? (
                    <motion.img 
                        initial={{ filter: "blur(10px)" }} 
                        animate={{ filter: "blur(0px)" }} 
                        src={resultImage} 
                        className='h-full w-full object-cover' 
                    />
                ) : (
                    <div className='h-full flex flex-col items-center justify-center text-slate-300 gap-2'>
                        <Eraser className='w-6 h-6 opacity-50' />
                        <span className='text-xs'>Result here</span>
                    </div>
                )}
             </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RemoveObject