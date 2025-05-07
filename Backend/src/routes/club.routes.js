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

const router = Router();

router.route("/createclub").post(verifyJWT, checkRole("admin"), createClub);
router.route("/mine").get(verifyJWT,getMyClubs);
router.route("/getallclub").get(verifyJWT, getallclub);
router.route("/getallclubleaders").get(getAllClubLeaders);
router.route("/:id").get(verifyJWT, getClubDetails);
router.route("/:id/joinclub").post(verifyJWT, joinClub);
router.route("/:id/members").get(verifyJWT, getClubMember);
router.route("/:id/coleaders").get(verifyJWT, getclubcoleader);
router.route("/:id/applicants").get(verifyJWT, getapplicants);
router.route("/:id/approveapplicants").post(verifyJWT, approveApplicants);
router.route("/:id/rejectapplicants").post(verifyJWT, rejectApplicants);
router.route("/:id/removemember").post(verifyJWT, removeMember);
router.route("/:id/makecoleader").post(verifyJWT, makeCoLeader);
router.route("/:id/makeleader").post(verifyJWT, makeLeader);
router.route("/:id/removecoleader").post(verifyJWT, removecoleader);
router.route("/:id/updatedescription").patch(verifyJWT, updateDescription);
router.route("/:id/updatecoverimg").patch(
  verifyJWT,
  upload.fields([
    {
      name: "coverimg",
      maxCount: 1,
    },
  ]),

  updateCoverImg
);
router.route("/:id/updatelogo").patch(
    verifyJWT,
    upload.fields([
        {
            name:"logo",
            maxCount:1,
        },
    ]),
    updateLogoImg);



export default router;
