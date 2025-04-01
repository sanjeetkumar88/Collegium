import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Pages/Home';
import Events from './components/Pages/Events';
import PageLayout from './components/layout/PageLayout';
import About from './components/Pages/About';
import Register from './components/Pages/Register';
import Login from './components/Pages/Login';
import ResourcePage from './components/Pages/ResoucePage';
import Club from './components/Pages/Club';
import ClubDetail from './components/Pages/ClubDetails';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* PageLayout as the wrapper for the main routes */}
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<ResourcePage />} />
          <Route path ="/community" element={<Club />} />
          <Route path = "/community/:id" element={<ClubDetail />} />

          
        </Route>

        {/* You can enable a NotFound route here */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
