import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/next"
import Home from "./components/Pages/Home";
import Events from "./components/Pages/Events";
import PageLayout from "./components/layout/PageLayout";
import About from "./components/Pages/About";
import Register from "./components/Pages/Register";
import Login from "./components/Pages/Login";
import ResourcePage from "./components/Pages/ResoucePage";
import Club from "./components/Pages/Club";
import ClubDetail from "./components/Pages/ClubDetails";
import CreateEventForm from "./components/Pages/CreateEvent";
import NotFound from "./components/Pages/NotFound";
import UnauthorizedPage from "./components/UnauthorizePage/UnauthorizedPage";
   
import PrivateRoute from "./routes/PrivateRoute"; 
import CreateClub from "./components/Pages/CreateClub";
import CreateNote from "./components/Pages/CreateNote";
import CreateProject from "./components/Pages/CreateProject";
import Projects from "./components/Pages/Projects";
import ProjectDetail from "./components/Pages/ProjectDetail";
import { useAuth } from "./context/AuthContext"; 
import EventDetails from "./components/Pages/EventDetails";
import EditEventForm from "./components/Pages/EditEventForm";  
import EventDashBoard from "./components/Pages/EventDashBoard";
import EventRSVPs from "./components/Pages/EventRSVPs";
import CreatedEvents from "./components/Pages/CreatedEvents";
import EventRequest from "./components/Pages/EventRequest";
import { useFetchClubLeader } from "./CustomHooks/useFetchClubLeader";

function App() {
  const auth = useAuth();
  const {isLeader} = useFetchClubLeader();
  
  return (
    
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={auth.authUser ? <Navigate to="/" replace /> : <Register />} />

        <Route path="/login" element={auth.authUser ? <Navigate to="/" replace /> : <Login />} />

        {/* Layout Routes */}
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="resources" element={<ResourcePage />} />

          {/* Protected Routes */}
          <Route
            path="resources/uploadnotes"
            element={
              <PrivateRoute
                element={<CreateNote />}
                allowedRoles={["admin", "teacher", "student"]}
              />
            }
          />

          <Route
            path="/events"
            element={
              <PrivateRoute
                element={<Events />}
                allowedRoles={["admin", "teacher", "student"]}
              />
            }
          />
          <Route
            path="community"
            element={
              <PrivateRoute
                element={<Club />}
                allowedRoles={["admin", "teacher", "student"]}
              />
            }
          />
          <Route
            path="community/:id"
            element={
              <PrivateRoute
                element={<ClubDetail />}
                allowedRoles={["admin", "teacher", "student"]}
              />
            }
          />
          <Route
            path="/events/createevent"
            element={
              <PrivateRoute
                element={<CreateEventForm />}
                allowedRoles={["admin", "teacher", "student"]}
              />
            }
          />
          <Route
            path="project/create-project"
            element={
              <PrivateRoute
                element={<CreateProject />}
                allowedRoles={["admin", "teacher", "student"]}
              />
            }
          />
          <Route
            path="community/createclub"
            element={
              <PrivateRoute element={<CreateClub />} allowedRoles={["admin"]} />
            }
          />

          <Route
            path="project/explore-projects"
            element={
              <PrivateRoute
                element={<Projects />}
                allowedRoles={["admin", "teacher", "student"]}
              />
            }
          />

          <Route
            path="project/explore-projects/:id"
            element={
              <PrivateRoute
                element={<ProjectDetail />}
                allowedRoles={["admin", "teacher", "student"]}
              />
            }
          />

          <Route 
          path="events/dashboard"
          element = {
            <PrivateRoute 
            element={<EventDashBoard />}
            allowedRoles={["admin", "teacher"]}
            isLeader={isLeader}
            />
          }
          />
          <Route 
          path="events/createdevent"
          element = {
            <PrivateRoute 
            element={<CreatedEvents />}
            allowedRoles={["admin", "teacher"]}
            isLeader={isLeader}
            />
          }
          />

          <Route 
          path="events/rsvp"
          element = {
            <PrivateRoute 
            element={<EventRSVPs />}
            allowedRoles={["admin", "teacher"]}
            isLeader={isLeader}
            />
          }
          />

          <Route 
          path="events/waitlist-users"
          element = {
            <PrivateRoute 
            element={<EventRequest />}
            allowedRoles={["admin", "teacher"]}
            isLeader={isLeader}
            />
          }
          />
         
          
          <Route 
          path="events/:id"
          element = {
            <PrivateRoute 
            element={<EventDetails />}
            allowedRoles={["admin", "teacher", "student"]}
            />
          }
          />

          
          <Route 
          path="events/:id/edit"
          element = {
            <PrivateRoute 
            element={<EditEventForm />}
            allowedRoles={["admin", "teacher"]}
            isLeader={isLeader}
            />
          }
          />

          




        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
