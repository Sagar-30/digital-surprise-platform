async function createOrderOnServer(amountInRupees) {
    const url = window.location.hostname === "localhost"
      ? "https://www.theindiansanta.com/.netlify/functions/createOrder"
      : "/.netlify/functions/createOrder";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInRupees })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create order");
    return data; // contains orderId, amount, currency, keyId
  }
  
async function loadRazorpayScript() {
    if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }
}

//payment Verify
async function verifyPayment(response) {
    // console.log("🔹 Step 1: Entered verifyPayment function");
    // const url = window.location.hostname === "localhost"
    //   ? "https://www.theindiansanta.com/.netlify/functions/verifyPayment"
    //   : "/.netlify/functions/verifyPayment";
    const url = window.location.hostname === "localhost"
        ? "http://localhost:8888/.netlify/functions/verifyPayment"
        : "/.netlify/functions/verifyPayment";

    // console.log("🔹 Step 2: URL selected for verification:", url);

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response)
    });
    // console.log("🔹 Step 4: Fetch response received. Status:", res.status);

    const data = await res.json();

    // console.log("🔹 Step 5: Parsed JSON response:", data);

    if (!data.success) {
        const msg = "Payment verification failed! Please try again after some time.";
        setCheckoutError(msg);
        throw new Error(msg);
    }
    // console.log("✅ Step 7: Payment verification successful. Returning data.");

    return data;
}

function openRazorpayCheckout({ orderId, amount, currency, keyId }, displayData, cartItems, total) {
    const options = {
      key: keyId,
      order_id: orderId,
      amount,
      currency,
      name: "Digital Surprise",
      description: "Gifts Payment",
      image: "https://www.theindiansanta.com/logo.png",
      // handler: async function (response) {
      //   try {
      //     //await verifyPayment(response);
      //     //await saveOrderToFirestore(order, displayData.uid);
      //     //check if order contains fully digital arts or partially
      //     // navigate(`/downloads/${displayData.uid}`);

      //   } catch (err) {
      //     // console.log(err);
      //     setCheckoutError("Something went wrong. Please try again.");
      //     setCheckoutError("Payment verification failed. Please contact support. OR try again")
      //   } finally {
      //     setMakingPayment(false);
      //   }
      // },
      // modal: { ondismiss: () => { setMakingPayment(false); setCheckoutError("Checkout Cancelled") } },
      // prefill: { name: displayData?.name ?? "", email: displayData?.email ?? "", contact: "" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

async function handlePaymentOnRazorpayNew(amountInRupees, displayData, cartItems, total) {
    try {
      setCheckoutError("")
      setMakingPayment(true);
      const orderData = await createOrderOnServer(amountInRupees);
      await loadRazorpayScript();
      openRazorpayCheckout(orderData, displayData, cartItems, total);
    } catch (err) {
      console.error("Payment init failed:", err);
      setCheckoutError(err?.message || "Something went wrong. Please try again.");
      setMakingPayment(false);
    }
  }