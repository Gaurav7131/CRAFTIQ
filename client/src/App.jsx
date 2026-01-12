import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import WriteArticle from './pages/WriteArticle'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import BlogTitles from './pages/BlogTitles'
const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>

        <Route path='/ai' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='/ai/write-article' element={<WriteArticle/>}/>
          <Route path='/ai/blog-titles' element={<BlogTitles/>}/>
        </Route>
      </Routes>
    </div>
      )
}

export default App