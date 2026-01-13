import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* The Navbar is fixed, so it sits on top of everything */}
      <Navbar/>
      
      {/* We wrap the main content in a <main> tag for better semantics */}
      <main className="flex flex-col gap-10">
        <Hero/>
        <AiTools/>
        <Testimonial/>
        <Plan/>
      </main>

      {/* The Footer sits at the bottom */}
      <Footer/>

    </div>
  )
}

export default Home