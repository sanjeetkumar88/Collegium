import { Router } from "express";
import { getNotes, uploadnotes } from "../controllers/notes.controller.js";
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

export default router;