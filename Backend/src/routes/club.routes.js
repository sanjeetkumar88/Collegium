import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createClub, getAllClubsForTeacherAndAdmin, getClubDetails } from "../controllers/club.controller.js";



const router = Router();



router.route("/createclub").post(createClub);

// router.route("/getallclub").get(verifyJWT,getAllClubsForTeacherAndAdmin);
router.route("/getallclub").get(getAllClubsForTeacherAndAdmin);
router.route("/:id").get(getClubDetails);


export default router;