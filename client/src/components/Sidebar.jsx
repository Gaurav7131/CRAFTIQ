import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import { 
  LayoutDashboard, 
  PenTool, 
  Type, 
  Image as ImageIcon, 
  Scissors, 
  Eraser, 
  FileText, 
  LogOut 
} from 'lucide-react'

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navigate = useNavigate();

  // Define your navigation menu items here
  const navItems = [
    { to: '/ai', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/ai/write-article', label: 'Write Article', icon: PenTool },
    { to: '/ai/blog-titles', label: 'Blog Titles', icon: Type },
    { to: '/ai/generate-images', label: 'Generate Images', icon: ImageIcon },
    { to: '/ai/remove-background', label: 'Remove Background', icon: Scissors },
    { to: '/ai/remove-object', label: 'Remove Object', icon: Eraser },
    { to: '/ai/review-resume', label: 'Review Resume', icon: FileText },
  ];

  // Handle Sign Out safely with React Router
  const handleSignOut = async () => {
    // We pass a callback to signOut to ensure the redirect happens 
    // strictly after the session is destroyed.
    await signOut(() => navigate('/'));
  };

  return (
    <>
      {/* --- MOBILE OVERLAY (Backdrop) --- */}
      {/* This creates a transparent/dark layer behind the sidebar on mobile. 
          Clicking it closes the sidebar. */}
      {sidebar && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 sm:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      <div 
        className={`
          w-64 bg-white border-r border-gray-200 flex flex-col 
          fixed sm:relative top-16 sm:top-0 h-[calc(100vh-64px)] z-40 
          transition-transform duration-300 ease-in-out shadow-xl sm:shadow-none
          ${sidebar ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        `}
      >
        
        {/* --- MENU ITEMS --- */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebar(false)} // Close sidebar on mobile when clicked
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon className={`w-5 h-5 ${item.label === 'Dashboard' ? '' : 'opacity-70'}`} />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* --- USER PROFILE & LOGOUT SECTION --- */}
        <div className="p-4 border-t border-gray-100 bg-slate-50/50">
          
          {/* User Info (Click to open Clerk Profile Modal) */}
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity p-2 rounded-md hover:bg-white border border-transparent hover:border-gray-200" 
            onClick={() => openUserProfile()}
            title="Manage Account"
          >
            {/* We use optional chaining (?) just in case user data is loading */}
            <img 
              src={user?.imageUrl} 
              alt="Profile" 
              className="w-9 h-9 rounded-full border border-gray-200 object-cover" 
            />
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold text-slate-900 truncate">
                {user?.fullName || 'User'}
              </h3>
              <p className="text-xs text-slate-500 truncate text-ellipsis w-32">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </div>
    </>
  )
}

export default Sidebar