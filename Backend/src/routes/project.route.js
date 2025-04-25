import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProject } from "../controllers/project.controller.js"

const router = Router();

router.route("/createproject").post(
    upload.fields([
            {
                name: "coverImage",
                maxCount: 1
            }]
            
        ),
    verifyJWT,createProject);




export default router;