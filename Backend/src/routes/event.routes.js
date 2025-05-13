import { Router } from "express";
import {createEvents, dashboard, deleteEvent, downloadEventSummaryXLS, downloadRegisteredUsersXLS, downloadWaitlistedUsersXLS, editEvents, getAllEvents, getCreatedEvent, getEventDetail, getRegisteredUsers, getRequest, getRsvps, getWaitlistedUsers, registerUser, registerUserWithPayment, updateWaitlistStatus} from "../controllers/event.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
 


router.route("/createevent").post(verifyJWT,
    upload.single("image"),
    createEvents,);

router.route("/getAllEvents").get(verifyJWT,getAllEvents);
router.route("/createdevents").get(verifyJWT,getCreatedEvent);
router.route("/rsvps").get(verifyJWT,getRsvps);
router.route("/requests").get(verifyJWT,getRequest);
router.route("/dashboard").get(verifyJWT,dashboard);
router.route("/editevent/:id").put(verifyJWT,editEvents);
router.route("/delete/:id").get(verifyJWT,deleteEvent);
router.route("/geteventdetail/:id").get(verifyJWT,getEventDetail);
router.route("/:id/register").post(verifyJWT,registerUser);
router.route("/:id/registerwithpayment").post(verifyJWT,registerUserWithPayment);
router.route("/:eventId/registered-users").get(verifyJWT,getRegisteredUsers);
router.route("/:eventId/registered-users/download").get(verifyJWT,downloadRegisteredUsersXLS);
router.route("/:eventId/waitlisted-users").get(verifyJWT,getWaitlistedUsers);
router.route("/:eventId/waitlisted-users/download").get(verifyJWT,downloadWaitlistedUsersXLS);
router.route("/:eventId/waitlist/:userId").get(verifyJWT,updateWaitlistStatus);
router.route("/:eventId/summary/download").get(verifyJWT,downloadEventSummaryXLS );


export default router;