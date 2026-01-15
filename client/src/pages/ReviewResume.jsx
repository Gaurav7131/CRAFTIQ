import { FileText, Sparkles, Loader2, UploadCloud } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {

  const [input, setInput] = useState(null)
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', input);

      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        }
      })

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-6 text-slate-700 bg-slate-50'>

      <div className='flex items-start flex-wrap gap-8 justify-center max-w-7xl mx-auto'>

        {/* LEFT COLUMN: Upload Form */}
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={onSubmitHandler}
          className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center'>
              <Sparkles className='w-6 text-[#00da83]' />
            </div>
            <h1 className='text-xl font-bold text-slate-800'>Resume Review</h1>
          </div>

          <p className='text-sm font-semibold text-slate-700 mb-2'>Upload Resume</p>
          
          {/* Stylized File Input Area */}
          <div className='relative group'>
            <input
              type="file"
              onChange={(e) => setInput(e.target.files[0])}
              accept='application/pdf'
              className='w-full p-3 text-sm text-slate-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all'
              required
            />
          </div>

          <p className='text-xs text-gray-400 font-medium mt-2 flex items-center gap-1'>
            <UploadCloud className='w-3 h-3' /> Supports PDF format only
          </p>

          {/* --- ANIMATED BUTTON START --- */}
          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full flex justify-center items-center gap-2 text-white px-4 py-4 mt-8 text-sm font-bold tracking-wide rounded-xl overflow-hidden shadow-lg shadow-emerald-500/25 transition-all
               ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#00da83] via-[#009bb3] to-[#00da83] bg-[length:200%_auto]'}
            `}
            animate={{
               backgroundPosition: ["0% 50%", "100% 50%"] 
            }}
            transition={{
               duration: 3,
               repeat: Infinity,
               ease: "linear"
            }}
          >
            {/* Shimmer Effect */}
            {!loading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
              />
            )}

            <div className='relative z-10 flex items-center gap-2'>
               {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <FileText className='w-5 h-5' />}
               {loading ? 'Analyzing Resume...' : 'Review Resume'}
            </div>
          </motion.button>
          {/* --- ANIMATED BUTTON END --- */}

        </motion.form>

        {/* RIGHT COLUMN: Analysis Result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[500px] max-h-[600px] overflow-hidden'
        >
          {/* Header */}
          <div className='p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3'>
            <FileText className='w-5 h-5 text-[#00da83]' />
            <h1 className='font-semibold text-slate-800'>Analysis Results</h1>
          </div>

          {/* Content Area */}
          <div className='flex-1 overflow-y-auto p-6 relative'>
            <AnimatePresence mode='wait'>
              {!content ? (
                /* Empty State */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className='h-full flex flex-col items-center justify-center text-center text-slate-400 gap-4'
                >
                  <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2'>
                    <FileText className='w-8 h-8 text-slate-300' />
                  </div>
                  <p className='text-sm max-w-[200px]'>
                    Upload your resume on the left and click Review to get AI-powered feedback.
                  </p>
                </motion.div>
              ) : (
                /* Text Content State */
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className='prose prose-sm prose-slate prose-headings:text-emerald-700 max-w-none'
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
  )
}

export default ReviewResume