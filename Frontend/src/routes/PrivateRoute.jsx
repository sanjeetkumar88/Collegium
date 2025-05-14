// // routes/PrivateRoute.jsx
// import { Navigate } from "react-router-dom"; // You manage auth from context or hooks
// import { useAuth } from "../context/Authcontext";

// const PrivateRoute = ({ element, allowedRoles,isLeader }) => {

// const user = useAuth();




//   if (!user.authUser) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user?.authUser.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return element;
// };

// export default PrivateRoute;


// routes/PrivateRoute.jsx
// import { Navigate } from "react-router-dom"; 
// import { useAuth } from "../context/Authcontext";

// const PrivateRoute = ({ element, allowedRoles, isLeader }) => {
//   const user = useAuth();

//   if (!user.authUser) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.authUser.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   else if (isLeader !== undefined && !isLeader) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return element;
// };

// export default PrivateRoute;


// routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ element, allowedRoles, isLeader }) => {
  const user = useAuth();

  if (!user.authUser) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.authUser.role;

  // If the user is in allowedRoles, bypass isLeader check
  if (allowedRoles && allowedRoles.includes(userRole)) {
    return element;
  }

  // If isLeader is undefined, perform role check
  if (isLeader === undefined) {
      if (allowedRoles && !allowedRoles.includes(user.authUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  }

  // If isLeader is false, redirect to unauthorized
  if (!isLeader) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default PrivateRoute;
