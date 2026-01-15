import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

const Plan = () => {
  return (
    <div className='relative max-w-6xl mx-auto z-20 my-32 px-6'>
      
      {/* Background Decorative Glow */}
      <div className='absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 animate-pulse'></div>

      {/* Header Section */}
      <div className='text-center space-y-6 mb-16'>
        
        {/* Animated Badge */}
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest animate-bounce shadow-xl'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500'></span>
          </span>
          Pricing
        </div>

        {/* Heading */}
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

      {/* CLERK PRICING TABLE 
          This component automatically:
          1. Detects if the user is on the "Free" plan (and marks it Active).
          2. Shows the "Subscribe" button for Premium ($17).
          3. Handles the Stripe payment securely.
      */}
      <div className='flex justify-center w-full'>
        <PricingTable />
      </div>

    </div>
  )
}

export default Plan