import React, { useState } from 'react'
import { dummyCreationData } from '../assets/assets' // Removed 'assets' to fix unused var error
import { Sparkles, Gem } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import { motion } from 'framer-motion' 

const Dashboard = () => {
  // Removed 'setCreations' to fix "assigned a value but never used" error
  const [creations] = useState(dummyCreationData || []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className='h-full overflow-y-scroll p-6'>
      
      {/* Changed <div> to <motion.div> so 'motion' is used */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex justify-start gap-4 flex-wrap'
      >
        
        {/* Total Creations Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md'
        >
          <div className='text-slate-600'>
            <p className='text-sm font-medium'>Total Creations</p>
            <h2 className='text-2xl font-bold mt-1 text-slate-800'>{creations.length}</h2>
          </div>
          {/* Fixed gradient class warning */}
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#3588f2] to-[#0bb0d7] text-white flex justify-center items-center shadow-lg shadow-blue-100'>
            <Sparkles className='w-6 h-6' />
          </div>
        </motion.div>

        {/* Active Plan Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md'
        >
          <div className='text-slate-600'>
            <p className='text-sm font-medium'>Active Plan</p>
            <h2 className='text-2xl font-bold mt-1'>
              <Protect fallback={<span className='text-slate-800'>Free</span>}>
                 <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600'>Premium</span>
              </Protect>
            </h2>
          </div>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff61c5] to-[#9e53ee] text-white flex justify-center items-center shadow-lg shadow-purple-100'>
             <Gem className='w-6 h-6' />
          </div>
        </motion.div>

      </motion.div>

      {/* Recent Creations List */}
      <div className='mt-8'>
        <h3 className='text-slate-700 font-semibold text-lg mb-4'>Recent Creations</h3>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className='space-y-4'
        >
           {creations.length > 0 ? (
              creations.map((item) => (
                 <motion.div key={item.id} variants={itemVariants}>
                    <CreationItem item={item} />
                 </motion.div>
              ))
           ) : (
              <p className="text-gray-500">No creations found.</p>
           )}
        </motion.div>
      </div>

    </div>
  )
}

export default Dashboard