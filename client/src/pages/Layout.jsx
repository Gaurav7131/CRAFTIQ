import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, Box, Loader2 } from 'lucide-react'; 
import Sidebar from '../components/Sidebar';
import { SignIn, useAuth } from '@clerk/clerk-react'; // Import useAuth

const Layout = () => {

  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { isSignedIn, isLoaded } = useAuth(); // Get auth state from Clerk

  // 1. Loading State: Prevent flickering while checking auth
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // 2. Unauthenticated State: Show Sign In ONLY (hide dashboard)
  if (!isSignedIn) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-slate-50'>
        <SignIn />
      </div>
    );
  }

  // 3. Authenticated State: Show the Full Dashboard
  return (
    <div className='flex flex-col min-h-screen bg-slate-50'>
      
      {/* --- DASHBOARD NAVBAR --- */}
      <nav className='sticky top-0 z-50 w-full px-4 sm:px-8 h-16 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm'>
        
        {/* --- LOGO SECTION --- */}
        <div 
            className='flex items-center gap-2 cursor-pointer group' 
            onClick={() => navigate("/")}
        >
            <div className="bg-indigo-600 p-1.5 rounded-lg transform group-hover:rotate-12 transition-transform duration-300 shadow-md shadow-indigo-200">
                <Box className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>

            <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-600">
                CRAFTIQ
            </span>
        </div>

        {/* --- SIDEBAR TOGGLE (Mobile) --- */}
        {
          sidebar 
          ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-slate-600 sm:hidden cursor-pointer hover:text-indigo-600 transition' />
          : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-slate-600 sm:hidden cursor-pointer hover:text-indigo-600 transition' />
        }
      </nav>

      {/* --- MAIN LAYOUT (Sidebar + Content) --- */}
      <div className='flex flex-1 relative h-[calc(100vh-64px)]'>
          
          <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

          <main className='flex-1 w-full bg-[#FAF7FB] overflow-y-auto p-4 sm:p-8'>
              <Outlet /> 
          </main>

      </div>
      
    </div>
  )
}

export default Layout