import crypto from "crypto";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
// const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET; 
const KEY_SECRET = "pnd7hZD244O5hoq7ApHeRuZh";


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8888",
  "https://splendorous-kitten-8af09b.netlify.app/"
];

export const handler = async (event) => {
  const origin = event.headers.origin || "";
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[1];

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ""
    };
  }

  try {

    ////console.log("Verifying Payment")
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      event.body ? JSON.parse(event.body) : {};

    ////console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing payment fields" })
      };
    }
    ////console.log("KEY_SECRET",KEY_SECRET)
    const generatedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    ////console.log("codes:",generatedSignature,"compare with:",razorpay_signature)

    if (generatedSignature !== razorpay_signature) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid signature" })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
};