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
import CreateEventForm from './components/Pages/createEvent';
import NotFound from './components/Pages/NotFound';
import UnauthorizedPage from './components/UnauthorizePage/UnauthorizedPage';

import PrivateRoute from './routes/PrivateRoute';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Layout Routes */}
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="resources" element={<ResourcePage />} />

        {/* Protected Routes */}
        <Route
          path="events"
          element={<PrivateRoute element={<Events />} allowedRoles={["admin", "teacher", "student"]} />}
        />
        <Route
          path="community"
          element={<PrivateRoute element={<Club />} allowedRoles={["admin", "teacher", "student"]} />}
        />
        <Route
          path="community/:id"
          element={<PrivateRoute element={<ClubDetail />} allowedRoles={["admin", "teacher", "student"]} />}
        />
        <Route
          path="createevent"
          element={<PrivateRoute element={<CreateEventForm />} allowedRoles={["admin", "teacher", "student"]} />}
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      <Route path = "/unauthorized" element = {<UnauthorizedPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
