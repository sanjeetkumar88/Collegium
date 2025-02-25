import { Router } from "express";
import { getNotes, uploadnotes } from "../controllers/notes.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/uploadnotes").post(
    upload.fields([
        {
            name: "notes",
            maxCount: 1
        }]
        
    ),
    verifyJWT,
    uploadnotes
    )

// router.route("/login").post(loginUser);

//secured routes

// router.route('/logout').post(verifyJWT,logoutUser);

// router.route('/refresh-token').post(refreshAccessToken);

router.route("/getnotes").get(getNotes);

export default router;