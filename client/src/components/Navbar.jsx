import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {UserButton, useClerk, useUser} from '@clerk/clerk-react'

const Navbar = () => {
    const navigate = useNavigate();

    const {user} = useUser();
    const {openSignIn} = useClerk();//.openSignIn;
    
  return (
    <div className='fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
        <img src={assets.logo} alt="Logo" className='w-32 sm:w-44 cursor-pointer' onClick={() => navigate('/')}/>


        <button  onClick={openSignIn}className='flex justify-center items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors'>
  Get Started <ArrowRight className='w-4 h-4'/>
</button>

    </div>
  )
}

export default Navbar