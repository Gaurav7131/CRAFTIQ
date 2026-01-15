import { Hash, Sparkles, Loader2, Type } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {

  const blogCategories = [
    'General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'
  ]

  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory} with maximum 10 titles`
      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
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
        
        {/* LEFT COLUMN: Configuration Form */}
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={onSubmitHandler}
          className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center'>
              <Sparkles className='w-6 text-[#8e37eb]' />
            </div>
            <h1 className='text-xl font-bold text-slate-800'>AI Title Generator</h1>
          </div>

          {/* Keyword Input */}
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-slate-700'>Keyword</label>
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className='w-full p-3 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all'
              placeholder='e.g., Artificial Intelligence, Healthy Cooking...'
              required
            />
          </div>

          {/* Category Selection */}
          <div className='mt-6 space-y-3'>
            <label className='text-sm font-semibold text-slate-700'>Category</label>
            <div className='flex gap-2 flex-wrap'>
              {blogCategories.map((item, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(item)}
                  className={`text-xs px-4 py-2 rounded-lg border font-medium transition-colors
                    ${selectedCategory === item
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-white text-slate-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          {/* --- ANIMATED BUTTON START --- */}
          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full flex justify-center items-center gap-2 text-white px-4 py-4 mt-8 text-sm font-bold tracking-wide rounded-xl overflow-hidden shadow-lg shadow-purple-500/25 transition-all
               ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#8e37eb] via-[#c341f6] to-[#8e37eb] bg-[length:200%_auto]'}
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
               {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <Hash className='w-5 h-5' />}
               {loading ? 'Generating Titles...' : 'Generate Titles'}
            </div>
          </motion.button>
          {/* --- ANIMATED BUTTON END --- */}

        </motion.form>

        {/* RIGHT COLUMN: Generated Result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[500px] max-h-[600px] overflow-hidden'
        >
          {/* Result Header */}
          <div className='p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3'>
            <Type className='w-5 h-5 text-purple-600' />
            <h2 className='font-semibold text-slate-800'>Generated Titles</h2>
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
                    <Hash className='w-8 h-8 text-slate-300' />
                  </div>
                  <p className='text-sm max-w-[200px]'>
                    Enter a keyword and category to discover catchy blog titles.
                  </p>
                </motion.div>
              ) : (
                /* Text Content State */
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className='prose prose-sm prose-slate prose-headings:text-purple-700 prose-a:text-purple-600 max-w-none'
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

export default BlogTitles