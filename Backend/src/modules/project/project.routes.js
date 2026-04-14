import { Router } from "express";
import { upload } from "../../shared/middlewares/multer.middleware.js";
import { verifyJWT } from "../../shared/middlewares/auth.middleware.js";
import { 
    createProject, 
    getAllProject, 
    getProjectDetail, 
    approveJoinRequest, 
    joinProject, 
    getProjectMembers, 
    leaveProject, 
    deleteProject, 
    getJoinRequests,
    updateProjectCoverImage,
    updateProjectDetails
} from "./project.controller.js";

const router = Router();

router.route("/create-project").post(
  verifyJWT,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  createProject
);

router.route("/getallproject").get(verifyJWT, getAllProject);
router.route("/getprojectdetail/:id").get(verifyJWT, getProjectDetail);
router.route("/join-project/:id").post(verifyJWT, joinProject);
router.route("/approve-join-request/:id").post(verifyJWT, approveJoinRequest);
router.route("/getprojectmembers/:id").get(verifyJWT, getProjectMembers);
router.route("/leave-project/:id").post(verifyJWT, leaveProject);
router.route("/delete-project/:id").delete(verifyJWT, deleteProject);
router.route("/getjoinrequests/:id").get(verifyJWT, getJoinRequests);
router.route("/update-cover-image/:id").patch(
  verifyJWT,
  upload.single("coverImage"),
  updateProjectCoverImage
);
router.route("/update-project-details/:id").patch(verifyJWT, updateProjectDetails);

export default router;
