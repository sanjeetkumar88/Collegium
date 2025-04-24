import { Router } from "express";
import { getNotes, uploadnotes,updateNote,deleteNote,getUserNotes } from "../controllers/notes.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/uploadnotes").post(
    upload.fields([
        {
            name: "notes",
            maxCount: 1
        }]
        
    ),
    verifyJWT,
    uploadnotes
    )



router.route("/getnotes").get(getNotes);

router.put("/:id", verifyJWT, updateNote);
router.get("/user/mynotes", verifyJWT, getUserNotes);
router.delete("/:id", verifyJWT, deleteNote);

export default router;