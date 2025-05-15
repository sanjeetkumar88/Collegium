import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createClub,
  getClubDetails,
  getAllClubLeaders,
  getallclub,
  joinClub,
  getClubMember,
  getclubcoleader,
  getapplicants,
  approveApplicants,
  rejectApplicants,
  removeMember,
  makeCoLeader,
  makeLeader,
  removecoleader,
  updateDescription,
  updateCoverImg,
  updateLogoImg,
  getMyClubs,
} from "../controllers/club.controller.js";
import { checkRole } from "../middlewares/checkRole.js";
import { isClubEditor } from "../middlewares/isClubEditor.js";

const router = Router();

// Public/admin club creation
router.route("/createclub").post(verifyJWT, checkRole("admin"), createClub);

// Clubs the current user is part of
router.route("/mine").get(verifyJWT, getMyClubs);

// All clubs (for home, listing, etc.)
router.route("/getallclub").get(verifyJWT, getallclub);

// All club leaders (public endpoint)
router.route("/getallclubleaders").get(getAllClubLeaders);

// Single club details
router.route("/:id").get(verifyJWT, getClubDetails);

// Join a club
router.route("/:id/joinclub").post(verifyJWT, joinClub);

// View club members
router.route("/:id/members").get(verifyJWT, getClubMember);

// View club co-leaders
router.route("/:id/coleaders").get(verifyJWT, getclubcoleader);

// View club applicants
router.route("/:id/applicants").get(verifyJWT, isClubEditor, getapplicants);

// Approve an applicant
router.route("/:id/approveapplicants").post(
  verifyJWT,
  isClubEditor,
  approveApplicants
);

// Reject an applicant
router.route("/:id/rejectapplicants").post(
  verifyJWT,
  isClubEditor,
  rejectApplicants
);

// Remove a member from club
router.route("/:id/removemember").post(
  verifyJWT,
  isClubEditor,
  removeMember
);

// Make a member co-leader
router.route("/:id/makecoleader").post(
  verifyJWT,
  isClubEditor,
  makeCoLeader
);

// Make a co-leader the leader
router.route("/:id/makeleader").post(
  verifyJWT,
  isClubEditor,
  makeLeader
);

// Remove a co-leader
router.route("/:id/removecoleader").post(
  verifyJWT,
  isClubEditor,
  removecoleader
);

// Update club description
router.route("/:id/updatedescription").patch(
  verifyJWT,
  isClubEditor,
  updateDescription
);

// Update club cover image
router.route("/:id/updatecoverimg").patch(
  verifyJWT,
  isClubEditor,
  upload.fields([{ name: "coverimg", maxCount: 1 }]),
  updateCoverImg
);

// Update club logo
router.route("/:id/updatelogo").patch(
  verifyJWT,
  isClubEditor,
  upload.fields([{ name: "logo", maxCount: 1 }]),
  updateLogoImg
);

export default router;
