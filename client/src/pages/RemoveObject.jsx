import { Eraser, Wand2, Loader2, Upload, ScanLine, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [imageFile, setImageFile] = useState(null);
  const [objectToEdit, setObjectToEdit] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const { getToken } = useAuth();

  // Clean up memory when preview changes
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

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

    if (!imageFile || !objectToEdit) {
      return toast.error("Please provide both an image and an object description");
    }

    // Original logic check for single object
    if (objectToEdit.trim().split(/\s+/).length > 1) {
      return toast("Please enter only one object name", {
        icon: <AlertCircle className="text-orange-500" />,
      });
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("object", objectToEdit);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setResultImage(data.content);
        toast.success("Object erased successfully!");
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
    <div className='h-full overflow-y-auto p-6 text-slate-700 bg-slate-50'>
      <div className='flex items-start flex-wrap gap-8 justify-center max-w-7xl mx-auto'>
        
        {/* Input Form */}
        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={onSubmitHandler}
          className='w-full max-w-lg p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-100/50'
        >
          <div className='flex items-center gap-4 mb-8'>
            <div className='w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200'>
              <Wand2 className='w-6 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-slate-800'>Magic Eraser</h1>
          </div>

          <div className='space-y-6'>
            {/* Step 1: Upload */}
            <div className='group'>
                <label className='flex items-center gap-2 text-sm font-bold text-slate-700 mb-2'>
                    <span className='bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs'>Step 1</span> Upload Image
                </label>
                <div className='relative w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl bg-blue-50/20 group-hover:bg-blue-50/50 transition-colors flex items-center justify-center overflow-hidden'>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {preview ? (
                        <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={preview} className="h-full w-full object-contain p-2" />
                    ) : (
                        <div className='flex flex-col items-center text-blue-300'>
                            <Upload className='w-8 h-8 mb-1' />
                            <span className='text-xs font-semibold'>Choose a photo</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Step 2: Description */}
            <div>
                 <label className='flex items-center gap-2 text-sm font-bold text-slate-700 mb-2'>
                    <span className='bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs'>Step 2</span> What to remove?
                </label>
                <input
                  type="text"
                  onChange={(e) => setObjectToEdit(e.target.value)}
                  value={objectToEdit}
                  className='w-full p-4 text-sm rounded-xl border border-gray-200 bg-slate-50 focus:bg-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm'
                  placeholder='e.g., spoon, watch, person...'
                  required
                />
                <p className='text-[10px] text-slate-400 mt-2 ml-1 italic'>Note: Please enter only a single object name for best results.</p>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            disabled={loading || !imageFile}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center items-center gap-2 text-white px-6 py-5 mt-8 text-base font-bold rounded-2xl shadow-xl transition-all relative overflow-hidden
               ${(loading || !imageFile) ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30'}
            `}
          >
            {loading && (
              <motion.div 
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            )}
            {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <Eraser className='w-5 h-5' />}
            <span className='relative z-10'>{loading ? 'Erase in progress...' : 'Remove Object'}</span>
          </motion.button>
        </motion.form>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col min-h-[500px] overflow-hidden'
        >
          <div className='p-5 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between'>
             <div className='flex items-center gap-2'>
                <ScanLine className='w-4 h-4 text-blue-500' />
                <h2 className='font-bold text-slate-700'>Comparison</h2>
             </div>
             {resultImage && (
               <a href={resultImage} download className='text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>Download</a>
             )}
          </div>
          
          <div className='flex-1 p-6 flex flex-col gap-4 bg-white'>
             {/* Original Preview */}
             <div className='flex-1 relative rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50'>
                <div className='absolute top-3 left-3 z-10 bg-slate-800/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter'>Original</div>
                {preview ? (
                  <img src={preview} className='h-full w-full object-contain' alt="Preview" />
                ) : (
                  <div className='h-full flex items-center justify-center text-slate-300 text-xs italic font-light'>No image uploaded</div>
                )}
             </div>

             {/* Result Preview */}
             <div className='flex-1 relative rounded-2xl overflow-hidden border-2 border-blue-50 bg-slate-50'>
                <div className='absolute top-3 left-3 z-10 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter'>Cleaned</div>
                <AnimatePresence mode="wait">
                  {resultImage ? (
                    <motion.img 
                      key="result"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      src={resultImage} 
                      className='h-full w-full object-contain' 
                      alt="Result"
                    />
                  ) : (
                    <div className='h-full flex flex-col items-center justify-center text-slate-300 gap-2'>
                        <Eraser className='w-6 h-6 opacity-20' />
                        <span className='text-[10px] uppercase font-bold tracking-widest opacity-40'>Awaiting Magic</span>
                    </div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RemoveObject;