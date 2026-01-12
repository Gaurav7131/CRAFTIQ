import React from 'react'

const AiTools = () => {
  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24 overflow-hidden'>
      <div className='text-center space-y-6'>
        
        {/* Animated Badge */}
        <div className='inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-50 border border-blue-100 animate-bounce'>
          <span className='text-blue-600 text-xs font-bold tracking-widest uppercase'>
            Innovation Lab
          </span>
        </div>

        {/* Heading */}
        <h2 className='text-slate-800 text-4xl md:text-6xl font-bold tracking-tight leading-tight'>
          Powerful <span className='bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent'>AI Suite</span>
        </h2>

        {/* Subtext - Fixed: Removed opacity-0 and custom animation */}
        <p className='text-gray-500 max-w-xl mx-auto text-lg md:text-xl leading-relaxed'>
          Harness the Power of AI to <span className='text-slate-900 font-semibold'>work smarter</span>, 
          innovate faster, and unlock new possibilities.
        </p>

        {/* Decorative Animated Line */}
        <div className='flex justify-center mt-8'>
            <div className='h-1 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse'></div>
        </div>
      </div>
    </div>
  )
}

export default AiTools