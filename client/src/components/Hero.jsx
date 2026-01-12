import React from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className='px-4 sm:px-20 xl:px-32 relative flex flex-col w-full items-center justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen'>
      
      {/* Text Section */}
      <div className='text-center mb-10'>
        <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'>
          Crafting Tomorrow's Content{' '}
          <span className='relative inline-block'>
            <span className='bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-pulse'>
              Todays!
            </span>
            <span className='absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 to-transparent'></span>
          </span>
        </h1>
        <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>
          Advanced Web-based Toolset for Intelligent Content Synthesis. Shaping the stories of tomorrow, Today.
        </p>
      </div>
      
      {/* Buttons Section */}
      <div className='flex flex-wrap justify-center gap-6 text-sm max-sm:text-xs'>
        {/* Start Creating Button */}
        <button 
          onClick={() => navigate('/ai')} 
          className='group relative flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-full font-medium overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg'
        >
          <span className='absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
          <span className='relative z-10 flex items-center gap-2'>
            Start Creating Now 
            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
          </span>
        </button>

        {/* Watch Demo Button */}
        <button 
          className='flex items-center gap-2 bg-white text-slate-700 px-10 py-4 rounded-full font-medium border border-slate-200 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-sm'
        >
          <PlayCircle className='w-5 h-5 text-blue-500' />
          Watch Demo
        </button>
      </div>

      {/* Trusted Section */}
      <div className='flex items-center gap-4 mt-12 mx-auto bg-gray-50/50 px-6 py-2 rounded-full border border-gray-100 w-fit'>
        {assets?.user_group ? (
            <img src={assets.user_group} className='h-8' alt="users" />
        ) : (
            <div className="h-8 w-24 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-400">Users Icons</div>
        )}
        <p className='text-gray-500 text-sm font-medium'>
          Trusted by <span className='text-slate-900 font-bold'>10k+</span> creators
        </p>
      </div>

    </div>
  )
}

export default Hero;