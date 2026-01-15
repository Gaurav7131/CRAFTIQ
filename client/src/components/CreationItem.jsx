import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { FileText, Image as ImageIcon, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CreationItem = ({ item }) => {
  
  const [expanded, setExpanded] = useState(false);

  // Handle date safely
  const dateString = item.createdAt || item.created_at;
  const displayDate = dateString 
    ? new Date(dateString).toLocaleDateString() 
    : 'Just now';

  return (
    <motion.div 
      layout 
      onClick={() => setExpanded(!expanded)} 
      whileHover={{ scale: 1.01, backgroundColor: "#f8fafc" }} 
      whileTap={{ scale: 0.99 }} 
      className='p-5 max-w-5xl bg-white border border-gray-200 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-colors'
    >
      <motion.div layout="position" className='flex justify-between items-center gap-4'>
        
        <div className='flex items-center gap-4 min-w-0'>
          
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
            ${item.type === 'image' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
            {item.type === 'image' ? <ImageIcon size={20}/> : <FileText size={20}/>}
          </div>
          
          <div className='min-w-0'>
            <h2 className='font-semibold text-slate-800 text-base truncate pr-4'>{item.prompt}</h2>
            <p className='text-slate-500 text-xs mt-0.5 font-medium'>
               <span className='capitalize'>{item.type}</span> • {displayDate}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3 shrink-0'>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border hidden sm:inline-block
                ${item.type === 'image' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}
            `}>
               {item.type}
            </span>

            <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400"
            >
                <ChevronDown size={20} />
            </motion.div>
        </div>

      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className='mt-4 pt-4 border-t border-gray-100'>
               {item.type === 'image' ? (
                 <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className='flex justify-center bg-slate-50 p-4 rounded-xl border border-slate-100'
                 >
                    <img src={item.content} alt="Generated" className='max-w-full max-h-[400px] object-cover rounded-lg shadow-sm' />
                 </motion.div>
               ) : (
                 <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className='text-slate-700 prose prose-sm max-w-none bg-slate-50 p-5 rounded-xl border border-slate-100'
                 >
                    <div className='reset-tw'>
                       <Markdown>{item.content}</Markdown>
                    </div>
                 </motion.div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CreationItem