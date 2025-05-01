import React from 'react';
import HeroSection from '../Frontepage/HeroSection';
import TestimonialMarquee from '../Frontepage/TestimonialMarquee';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="absolute inset-0 bg-[url('/texture.svg')] opacity-[0.07] bg-cover bg-center pointer-events-none" />

{/* Optional blurred blobs */}
<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[60vw] h-[60vw] bg-indigo-300 opacity-30 rounded-full blur-3xl z-0" />
<div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 opacity-20 rounded-full blur-2xl z-0" />

      {/* Optional padding or layout container */}
      <main className="">
        <HeroSection />
        <TestimonialMarquee />

        
      </main>
    </div>
  );
};

export default Home;
