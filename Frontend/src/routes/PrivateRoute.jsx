// routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom"; // You manage auth from context or hooks
import { useAuth } from "../context/Authcontext";

const PrivateRoute = ({ element, allowedRoles }) => {

const user = useAuth();




  if (!user.authUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.authUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default PrivateRoute;
