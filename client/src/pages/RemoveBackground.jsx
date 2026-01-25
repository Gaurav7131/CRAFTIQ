import React, { useState, useEffect } from 'react';
import { Eraser, Sparkles, UploadCloud, Download, Loader2, Scissors } from 'lucide-react';
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  // Clean up preview URL to prevent memory leaks
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(file);
      setPreview(URL.createObjectURL(file));
      setContent(""); // Reset result when new image is uploaded
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error("Please upload an image!");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", input);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Background removed successfully!");
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
    <div className="h-full overflow-y-auto p-6 bg-slate-50 text-slate-700">
      <div className="flex items-start flex-wrap gap-8 justify-center max-w-7xl mx-auto">
        
        {/* Left Column: Upload Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-100/40"
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
               animate={{ rotate: [0, -10, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F6AB41] to-[#FF4938] flex items-center justify-center shadow-lg shadow-orange-200"
            >
              <Sparkles className="w-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-800">Background Removal</h1>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-600 ml-1">Upload Photo</label>
            <motion.div 
              whileHover={{ scale: 1.01, borderColor: '#FF4938' }}
              className="relative w-full h-60 border-2 border-dashed border-gray-300 rounded-2xl bg-orange-50/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors"
            >
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                required
              />
              {preview ? (
                <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={preview} className="h-full w-full object-contain p-4" />
              ) : (
                <div className="text-center p-4">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <UploadCloud className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                  </motion.div>
                  <p className="text-sm text-slate-500 font-semibold">Click to browse or drag image</p>
                  <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG</p>
                </div>
              )}
            </motion.div>
          </div>

          <motion.button
            disabled={loading || !input}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full relative flex justify-center items-center gap-2 text-white px-6 py-4 mt-8 text-base font-bold rounded-2xl shadow-xl transition-all
              ${(loading || !input) ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-[#F6AB41] to-[#FF4938] shadow-orange-500/30'}
            `}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eraser className="w-5" />}
            <span>{loading ? 'Processing...' : 'Remove Background'}</span>
          </motion.button>
        </motion.form>

        {/* Right Column: Result Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col min-h-[500px] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#FF4938]" /> Processed Result
            </h2>
            {content && (
              <a 
                href={content} 
                download="removed_bg.png" 
                className="text-xs font-bold text-[#FF4938] bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Save
              </a>
            )}
          </div>

          {/* Transparent Checkerboard Area */}
          <div 
            className="flex-1 flex items-center justify-center p-8 bg-slate-100"
            style={{ backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uPBAp8hhARgOPv7859YDQ6M5uMA8CCAYmFoscEAtHIK8h8MABLIAsMeC98OAAAAAElFTkSuQmCC')` }}
          >
            <AnimatePresence mode="wait">
              {content ? (
                <motion.img
                  key="result-img"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={content}
                  className="max-w-full max-h-[380px] object-contain drop-shadow-2xl"
                />
              ) : (
                <motion.div 
                  key="empty-state"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-center text-slate-400"
                >
                  <div className="bg-slate-200/50 p-5 rounded-full mb-4 inline-block">
                    <Eraser className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="text-sm font-medium italic">Upload an image and let the magic happen</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default RemoveBackground;