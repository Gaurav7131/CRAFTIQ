import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24 overflow-hidden'>
      {/* Header Section */}
      <div className='text-center space-y-6'>
        <div className='inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-50 border border-blue-100 animate-bounce'>
          <span className='text-blue-600 text-xs font-bold tracking-widest uppercase'>
            Innovation Lab
          </span>
        </div>

        <h2 className='text-slate-800 text-4xl md:text-6xl font-bold tracking-tight leading-tight'>
          Powerful <span className='bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent'>AI Suite</span>
        </h2>

        <p className='text-gray-500 max-w-xl mx-auto text-lg md:text-xl leading-relaxed'>
          Harness the Power of AI to <span className='text-slate-900 font-semibold'>work smarter</span>, 
          innovate faster, and unlock new possibilities.
        </p>

        {/* Decorative Animated Line */}
        <div className='flex justify-center mt-8'>
          <div className='h-1 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse'></div>
        </div>
      </div>

      {/* Tools Grid Section - MOVED OUTSIDE THE HEADER DIV */}
      <div className='flex flex-wrap mt-16 justify-center gap-6'>
        {AiToolsData.map((tool, index) => (
          <div 
            key={index} 
            onClick={() => user ? navigate(tool.path) : openSignIn()} 
            className='p-8 w-full sm:w-[320px] rounded-2xl bg-white shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group'
          >
            <tool.Icon 
              className='w-12 h-12 p-3 text-white rounded-xl transition-transform group-hover:scale-110' 
              style={{ background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})` }} 
            />
            <h3 className='mt-6 mb-3 text-xl font-bold text-slate-800'>{tool.title}</h3>
            <p className='text-gray-500 text-sm leading-relaxed'>{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AiTools