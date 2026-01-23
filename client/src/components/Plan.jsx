import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

const Plan = () => {
  return (
    <div className='relative w-full py-20 px-4'>
      
      {/* Background Decorative Glow (Scaled down) */}
      <div className='absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl -z-10 animate-pulse'></div>

      {/* Header Section (More compact) */}
      <div className='text-center space-y-4 mb-12'>
        
        {/* Animated Badge */}
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest animate-bounce shadow-lg'>
          <span className='relative flex h-1.5 w-1.5'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500'></span>
          </span>
          Pricing
        </div>

        {/* Heading */}
        <h2 className='text-slate-900 text-3xl md:text-5xl font-bold tracking-tight'>
          Simple, Transparent <span className='bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'>Pricing</span>
        </h2>

        {/* Subtext */}
        <p className='text-slate-500 max-w-lg mx-auto text-lg font-medium leading-relaxed'>
          Choose the perfect plan to craft your legacy.
        </p>
      </div>

      {/* CLERK PRICING TABLE WRAPPER 
         - max-w-5xl: Restricts width so boxes don't get too wide.
         - mx-auto: Centers it perfectly.
      */}
      <div className='w-full max-w-5xl mx-auto'>
        <PricingTable />
      </div>

    </div>
  )
}

export default Plan