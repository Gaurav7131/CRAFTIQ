import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Box } from 'lucide-react'; // Added 'Box' for the logo icon
import { UserButton, useClerk, useUser } from '@clerk/clerk-react'

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { openSignIn } = useClerk();

    return (
        <div className='fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/50 border-b border-gray-100 flex justify-between items-center py-4 px-4 sm:px-20 xl:px-32 transition-all duration-300'>
            
            {/* --- LOGO SECTION START --- */}
            <div 
                className='flex items-center gap-2 cursor-pointer group' 
                onClick={() => navigate("/")}
            >
                {/* Animated Logo Icon */}
                <div className="bg-indigo-600 p-1.5 rounded-lg transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-200">
                     {/* You can swap 'Box' with any other icon from lucide-react if you prefer */}
                    <Box className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>

                {/* Text Logo: CRAFTIQ */}
                <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-600">
                    CRAFTIQ
                </span>
            </div>
            {/* --- LOGO SECTION END --- */}

            {/* Auth Buttons */}
            {
                user ? (
                    <div className="flex items-center gap-4">
                        {/* Optional: Add a Dashboard link if user is logged in */}
                        <button onClick={()=>navigate('/dashboard')} className='hidden sm:block text-sm font-medium text-gray-600 hover:text-indigo-600 transition'>Dashboard</button>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                ) : (
                    <button 
                        onClick={openSignIn} 
                        className='group flex items-center gap-2 rounded-full text-sm font-semibold cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 transition-all shadow-md hover:shadow-lg'
                    >
                        Get started 
                        <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform'/>
                    </button>
                )
            }
        </div>
    )
}

export default Navbar