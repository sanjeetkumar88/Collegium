import crypto from 'crypto';
import razorpay from '../utils/razorpay.js';

export const createOrder = async (req, res) => {
    
  const { amount, currency = 'INR', receipt = 'receipt#1' } = req.body;
  console.log(amount,currency);
  

  try {
    const options = {
      amount: amount * 100, // paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error });
  }
};

export const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest('hex');

  if (digest === razorpay_signature) {
    res.json({ success: true, message: 'Payment verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
};


