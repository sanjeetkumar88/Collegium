import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProject, getAllProject, getProjectDetail } from "../controllers/project.controller.js"

const router = Router();

router.route("/createproject").post(
    upload.fields([
            {
                name: "coverImage",
                maxCount: 1
            }]
            
        ),
    verifyJWT,createProject);

router.route("/getallprojects").get(verifyJWT,getAllProject);

router.route("/:id").get(verifyJWT,getProjectDetail);




export default router;