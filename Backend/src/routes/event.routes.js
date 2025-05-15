import { Router } from "express";
import {createEvents, dashboard, deleteEvent, downloadEventSummaryXLS, downloadRegisteredUsersXLS, downloadWaitlistedUsersXLS, editEvents, getAllEvents, getCreatedEvent, getEventDetail, getRegisteredUsers, getRequest, getRsvps, getWaitlistedUsers, registerUser, registerUserWithPayment, removeMember, updateWaitlistStatus} from "../controllers/event.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {canCreateEvent} from "../middlewares/canCreateEvent.js";


const router = Router();
 


router.route("/createevent").post(verifyJWT,
    upload.single("image"),
    canCreateEvent,
    createEvents,);

router.route("/getrequstedusers").get(verifyJWT,getRequest);
router.route("/getAllEvents").get(verifyJWT,getAllEvents);
router.route("/createdevents").get(verifyJWT,getCreatedEvent);
router.route("/rsvps").get(verifyJWT,getRsvps);
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
router.route("/:eventId/waitlist/:userId").post(verifyJWT,updateWaitlistStatus);
router.route("/:eventId/summary/download").get(verifyJWT,downloadEventSummaryXLS );
router.route("/:eventId/remove-member/:memberId").post(verifyJWT,removeMember);


export default router;