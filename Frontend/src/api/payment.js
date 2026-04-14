import apiClient from "./apiClient";

export const createOrder = (data) => apiClient.post("/payment/create-order", data);
export const verifyPayment = (data) => apiClient.post("/payment/verify-payment", data);
