import { Router } from "express";
import { uploadnotes, getNotes, deleteNote, updateNote, getUserNotes } from "./notes.controller.js";
import { upload } from "../../shared/middlewares/multer.middleware.js";
import { verifyJWT } from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.route("/upload").post(
  verifyJWT,
  upload.fields([
    {
      name: "notes",
      maxCount: 1,
    },
  ]),
  uploadnotes
);

router.route("/getnotes").get(getNotes);
router.route("/getusernotes").get(verifyJWT, getUserNotes);
router.route("/deletenote/:id").delete(verifyJWT, deleteNote);
router.route("/updatenote/:id").patch(verifyJWT, updateNote);

export default router;
