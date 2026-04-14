import React from 'react'
import Navbar from '../common/Navbar';
import { Outlet } from "react-router-dom";
import Footer from '../features/landing/Footer';

function PageLayout() {
    return (
        <div className="min-h-screen flex flex-col">
      
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
 
      
    </div>
    )
}

export default PageLayout
