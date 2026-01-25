import { FileText, Sparkles, Loader2, UploadCloud } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error("Please select a PDF file first");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', input);

      const token = await getToken();
      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Analysis complete!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-auto p-6 text-slate-700 bg-slate-50'>
      <div className='flex items-start flex-wrap gap-8 justify-center max-w-7xl mx-auto'>
        
        {/* LEFT COLUMN: Upload Form */}
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onSubmit={onSubmitHandler}
          className='w-full max-w-lg p-8 bg-white rounded-2xl border border-gray-200 shadow-xl shadow-slate-200/50'
        >
          <div className='flex items-center gap-4 mb-8'>
            <div className='w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shadow-inner'>
              <Sparkles className='w-6 text-[#00da83]' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-slate-800 tracking-tight'>Resume Review</h1>
              <p className='text-xs text-slate-400 font-medium'>AI-powered career optimization</p>
            </div>
          </div>

          <div className='space-y-4'>
            <label className='text-sm font-bold text-slate-700 ml-1'>Upload Resume</label>
            <div className='relative group'>
              <input
                type="file"
                onChange={(e) => setInput(e.target.files[0])}
                accept='application/pdf'
                className='w-full p-3 text-sm text-slate-500 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-white hover:border-emerald-400 focus:outline-none transition-all'
                required
              />
            </div>
            <p className='text-[11px] text-gray-400 font-medium flex items-center gap-1.5 ml-1'>
              <UploadCloud className='w-3.5 h-3.5' /> PDF files only (Max 5MB)
            </p>
          </div>

          {/* --- ANIMATED BUTTON --- */}
          <motion.button
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, translateY: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`relative w-full flex justify-center items-center gap-3 text-white px-6 py-4 mt-10 text-sm font-black uppercase tracking-widest rounded-xl overflow-hidden shadow-lg transition-all
               ${loading ? 'bg-emerald-400 cursor-wait' : 'bg-gradient-to-r from-[#00da83] via-[#009bb3] to-[#00da83] bg-[length:200%_auto] shadow-emerald-500/30'}
            `}
            animate={!loading ? { backgroundPosition: ["0% 50%", "100% 50%"] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            {/* Shimmer Effect */}
            {!loading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
                initial={{ x: '-150%' }}
                animate={{ x: '250%' }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
              />
            )}

            <div className='relative z-10 flex items-center gap-2'>
               {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <FileText className='w-5 h-5' />}
               <span>{loading ? 'Analyzing Content...' : 'Review My Resume'}</span>
            </div>
          </motion.button>
        </motion.form>

        {/* RIGHT COLUMN: Analysis Result */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className='w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-xl shadow-slate-200/50 flex flex-col min-h-[500px] max-h-[600px] overflow-hidden'
        >
          {/* Header */}
          <div className='p-5 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-emerald-50 rounded-lg'>
                <FileText className='w-5 h-5 text-[#00da83]' />
              </div>
              <h1 className='font-bold text-slate-800 tracking-tight'>Analysis Results</h1>
            </div>
            {content && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='px-2 py-1 bg-emerald-500 text-[10px] font-bold text-white rounded uppercase'>
                Live Review
              </motion.div>
            )}
          </div>

          {/* Content Area */}
          <div className='flex-1 overflow-y-auto p-6 scrollbar-hide'>
            <AnimatePresence mode='wait'>
              {!content ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className='h-full flex flex-col items-center justify-center text-center text-slate-400 gap-5'
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className='w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center shadow-inner'
                  >
                    <FileText className='w-10 h-10 text-slate-200' />
                  </motion.div>
                  <div className='space-y-1'>
                    <p className='text-sm font-bold text-slate-500'>Ready for feedback?</p>
                    <p className='text-xs max-w-[240px] leading-relaxed'>
                      Upload your resume to receive professional suggestions on structure, keywords, and impact.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className='prose prose-emerald prose-headings:font-bold prose-p:leading-relaxed prose-li:my-1'
                >
                  <div className='reset-tw'>
                    <Markdown>{content}</Markdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ReviewResume;