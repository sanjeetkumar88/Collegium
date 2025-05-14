import { ApiError } from "../utils/ApiError.js";


export const checkRole = (...allowedRoles) =>{
    return (req, res, next) => {
        const userRole = req.user?.role;
    
        if (!userRole) {
          return next(new ApiError(401, "User role not found"));
        }
    
        if (!allowedRoles.includes(userRole)) {
          return next(new ApiError(403, "Access denied: insufficient permissions"));
        }
    
        next();
      };
}