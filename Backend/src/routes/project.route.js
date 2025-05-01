import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { approveJoinRequest, createProject, deleteProject, getAllProject, getJoinRequests, getProjectDetail, joinProject, updateProjectCoverImage, updateProjectDetails } from "../controllers/project.controller.js"

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
router.route("/:id/joinprojectrequest").post(verifyJWT,joinProject);
router.route("/:id/getjoinrequest").get(verifyJWT,getJoinRequests);
router.route("/:id/joinrequests/approve").post(verifyJWT,approveJoinRequest);
router.route("/:id/joinrequests/reject").post(verifyJWT,approveJoinRequest);
router.route("/:id/editcoverimg").post(verifyJWT,
    upload.single("coverImage"),
    updateProjectCoverImage
)
router.route("/:id/editprojectdetails").post(verifyJWT,updateProjectDetails)
router.route("/:id/deleteproject").post(verifyJWT,deleteProject);




export default router;