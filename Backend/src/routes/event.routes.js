import { Router } from "express";
import {createEvents, deleteEvent, editEvents, getAllEvents, getEventDetail, registerUser} from "../controllers/event.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
 


router.route("/createevent").post(verifyJWT,
    upload.single("image"),
    createEvents,);

router.route("/getAllEvents").get(verifyJWT,getAllEvents);
router.route("/editevent/:id").put(verifyJWT,editEvents);
router.route("/delete/:id").get(verifyJWT,deleteEvent);
router.route("/geteventdetail/:id").get(verifyJWT,getEventDetail);
router.route("/:id/register").post(verifyJWT,registerUser);


export default router;