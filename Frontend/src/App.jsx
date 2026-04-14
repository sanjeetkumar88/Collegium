import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import PageLayout from "./components/layout/PageLayout";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResourcePage from "./pages/ResoucePage";
import Club from "./pages/Club";
import ClubDetail from "./pages/ClubDetails";
import CreateEventForm from "./pages/CreateEvent";
import NotFound from "./pages/NotFound";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import PrivateRoute from "./routes/guards/PrivateRoute"; 
import CreateClub from "./pages/CreateClub";
import CreateNote from "./pages/CreateNote";
import CreateProject from "./pages/CreateProject";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import { useAuth } from "./context/AuthContext"; 
import EventDetails from "./pages/EventDetails";
import EditEventForm from "./pages/EditEventForm";  
import EventDashBoard from "./pages/EventDashBoard";
import EventRSVPs from "./pages/EventRSVPs";
import CreatedEvents from "./pages/CreatedEvents";
import EventRequest from "./pages/EventRequest";
import { useFetchClubLeader } from "./hooks/useFetchClubLeader";

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
