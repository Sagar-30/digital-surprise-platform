import Razorpay from "razorpay";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET
});

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": event.headers.origin || "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }
  // console.log("Using Razorpay Key:", process.env.RAZORPAY_KEY_ID);
  try {
    // console.log("Using Razorpay Key:", process.env.RAZORPAY_KEY_ID);

    const body = event.body ? JSON.parse(event.body) : {};
    const amount = Number(body.amount); // rupees

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": event.headers.origin || "*" },
        body: JSON.stringify({ error: "Invalid amount" })
      };
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `TIS_ORDER_${Date.now()}`,
      notes: { source: "netlify-function" }
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": event.headers.origin || "*"
      },
      body: JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: KEY_ID
      })
    };
  } catch (err) {
    console.error("createOrder error:");
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": event.headers.origin || "*" },
      body: JSON.stringify({ error: err.message || "Server error" })
    };
  }
};
