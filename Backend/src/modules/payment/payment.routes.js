import { Router } from "express";
import { verifyJWT } from "../../shared/middlewares/auth.middleware.js";
import { createOrder, verifyPayment } from "./payment.controller.js";

const router = Router();

router.route("/create-order").post(verifyJWT, createOrder);
router.route("/verify-payment").post(verifyJWT, verifyPayment);

export default router;
