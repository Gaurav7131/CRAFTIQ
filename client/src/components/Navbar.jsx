import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
    
    const navigate = useNavigate();
  return (
    <div className='fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
        <img src={assets.logo} alt="Logo" className='w-32 sm:w-44' onClick={() => navigate('/')}/>


        <button className='flex justify-center items-center gap-1 pt-1'>
            Get Started <ArrowRight className='w-4 h-4'/>
        </button>

    </div>
  )
}

export default Navbar