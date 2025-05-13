import { Router } from "express";
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';


const router = Router();


// router.post('/create-order', createOrder);
// router.post('/verify', verifyPayment);

router.route('/create-order').post(createOrder);
router.route('/verify-payment').post(verifyPayment);

export default router;
