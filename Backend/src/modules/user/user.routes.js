import { Router } from "express";
import { 
    getAllStudents, 
    getAllTeacher, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    verifyUser,
    getUserProfile,
    updateProfile,
    updateAccountDetails,
    updateUserAvatar
} from "./user.controller.js";
import { upload } from '../../shared/middlewares/multer.middleware.js'
import { verifyJWT } from "../../shared/middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);

// Secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/verify').get(verifyJWT, verifyUser);
router.route('/getallstudents').get(verifyJWT, getAllStudents);
router.route('/getallteachers').get(verifyJWT, getAllTeacher);

// Profile and Account routes
router.route('/profile').get(verifyJWT, getUserProfile);
router.route('/profile/update').patch(verifyJWT, updateProfile);
router.route('/account/update').patch(verifyJWT, updateAccountDetails);
router.route('/avatar/update').patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
