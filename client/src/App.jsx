import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

// Page Imports
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import { Toaster } from 'react-hot-toast'

const App = () => {
  // 1. Get Auth State
  const { isLoaded, isSignedIn, getToken } = useAuth();

  // 2. Debugging: Check Token (Optional)
  useEffect(() => {
    if (isSignedIn) {
      getToken().then((token) => console.log("Current User Token:", token));
    }
  }, [isSignedIn, getToken]);

  // 3. Show a loading screen while Clerk initializes
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <Toaster/>
      <Routes>
        {/* Public Landing Page */}
        <Route path='/' element={<Home />} />

        {/* Protected AI Suite Routes 
            IMPORTANT: For these children to show, your <Layout /> 
            must contain an <Outlet /> tag.
        */}
        <Route path='/ai' element={isSignedIn ? <Layout /> : <Navigate to="/" />}>
          <Route index element={<Dashboard />} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<GenerateImages />} />
          <Route path='remove-background' element={<RemoveBackground />} />
          <Route path='remove-object' element={<RemoveObject />} />
          <Route path='review-resume' element={<ReviewResume />} />
          <Route path='community' element={<Community />} />
        </Route>

        {/* Catch-all for 404s */}
        <Route path='*' element={<div>Page Not Found</div>} />
      </Routes>
    </div>
  )
}

export default App