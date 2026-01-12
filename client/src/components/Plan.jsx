import React from 'react'
import {PricingTable} from '@clerk/clerk-react'


const Plan = () => {
  return (
    <div className='relative max-w-4xl mx-auto z-20 my-32 px-6'>
      
      {/* Background Decorative Glow - Helps with visual depth */}
      <div className='absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 animate-pulse'></div>

      <div className='text-center space-y-6'>
        
        {/* Animated Badge */}
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest animate-bounce shadow-xl'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500'></span>
          </span>
          Pricing
        </div>

        {/* Heading - Removed opacity-0 so it is visible immediately */}
        <h2 className='text-slate-800 text-4xl md:text-6xl font-bold tracking-tight leading-tight'>
          Choose Your <span className='bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'>Plan</span>
        </h2>

        {/* Subtext */}
        <div className='relative inline-block'>
            <p className='text-slate-500 max-w-lg mx-auto text-lg md:text-xl font-medium leading-relaxed italic'>
              "Unlock Your Potential. Scale Your Spark. <br />
              <span className='text-blue-600 not-italic font-bold'>Elevate Your Impact. Craft Your Legacy.</span>"
            </p>
            {/* Subtle gradient line */}
            <div className='h-0.5 w-1/3 bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-4'></div>
        </div>
      </div>

      {/* Pricing Cards Grid - Placeholder cards so you can see the layout */}
      <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
        
        {/* Example Card 1 */}
        <div className='p-8 rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-sm hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl'>
            <h3 className='text-xl font-bold text-slate-800'>Basic</h3>
            <p className='text-3xl font-bold mt-4'>$0 <span className='text-sm text-slate-500 font-normal'>/mo</span></p>
            <button className='w-full mt-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors'>Get Started</button>
        </div>

        {/* Example Card 2 (Featured) */}
        <div className='p-8 rounded-3xl border-2 border-blue-500 bg-white shadow-2xl scale-105 relative'>
            <span className='absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-widest'>Popular</span>
            <h3 className='text-xl font-bold text-slate-800'>Professional</h3>
            <p className='text-3xl font-bold mt-4'>$17 <span className='text-sm text-slate-500 font-normal'>/mo</span></p>
            <button className='w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors'>Upgrade Now</button>
        </div>

        {/* Example Card 3 
        <div className='p-8 rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-sm hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl'>
            <h3 className='text-xl font-bold text-slate-800'>Business</h3>
            <p className='text-3xl font-bold mt-4'>$49 <span className='text-sm text-slate-500 font-normal'>/mo</span></p>
            <button className='w-full mt-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors'>Contact Us</button>
        </div>*/}

      </div>
      <div className='mt-14 max-sm:mx-8'>
        <PricingTable/>
      </div>
    </div>
  )
}

export default Plan