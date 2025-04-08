import { Router } from "express";
import {createEvents} from "../controllers/event.controller.js"


const router = Router();



router.route("/createevent").post(createEvents);


export default router;