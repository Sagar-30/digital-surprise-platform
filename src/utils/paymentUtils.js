import toast from 'react-hot-toast';

// Create order on server
async function createOrderOnServer(amountInRupees, surpriseId) {
  const isLocal = window.location.hostname === 'localhost';
  const url = isLocal 
    ? 'http://localhost:8888/.netlify/functions/createOrder'
    : '/.netlify/functions/createOrder';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      amount: amountInRupees,
      surpriseId: surpriseId 
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to create order');
  return data;
}

// Verify payment on server
async function verifyPaymentOnServer(paymentData) {
  const isLocal = window.location.hostname === 'localhost';
  const url = isLocal 
    ? 'http://localhost:8888/.netlify/functions/verifyPayment'
    : '/.netlify/functions/verifyPayment';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment verification failed');
  }
  return data;
}

// Load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Main payment function
export async function initiatePayment(surpriseId, amount = 199) {
  let loadingToastId = null;
  
  try {
    // Show loading toast
    loadingToastId = toast.loading('Preparing payment...');
    
    // Step 1: Create order on server
    const orderData = await createOrderOnServer(amount, surpriseId);
    
    // Step 2: Load Razorpay script
    await loadRazorpayScript();
    
    // Step 3: Open Razorpay checkout
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'Digital Surprise Box',
      description: 'Create a magical birthday surprise',
      image: 'https://splendorous-kitten-8af09b.netlify.app/favicon.svg',
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#ec4899',
      },
      modal: {
        ondismiss: () => {
          toast.dismiss(loadingToastId);
          toast.error('Payment cancelled');
        },
      },
      handler: async (response) => {
        try {
          toast.loading('Verifying payment...', { id: loadingToastId });
          
          // Step 4: Verify payment
          const verificationData = await verifyPaymentOnServer({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            surpriseId: surpriseId,
          });
          
          if (verificationData.success) {
            toast.success('Payment successful! 🎉', { id: loadingToastId });
            return { success: true, data: verificationData };
          } else {
            throw new Error('Verification failed');
          }
        } catch (error) {
          toast.error(error.message || 'Payment verification failed', { id: loadingToastId });
          return { success: false, error: error.message };
        }
      },
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
    
    return { success: true, orderId: orderData.orderId };
    
  } catch (error) {
    if (loadingToastId) {
      toast.error(error.message || 'Payment failed. Please try again.', { id: loadingToastId });
    } else {
      toast.error(error.message || 'Payment failed. Please try again.');
    }
    return { success: false, error: error.message };
  }
}

// Alternative: Simplified version with callback
export async function processPayment(surpriseId, amount = 199, onSuccess, onError) {
  const result = await initiatePayment(surpriseId, amount);
  
  if (result.success && onSuccess) {
    onSuccess(result);
  } else if (!result.success && onError) {
    onError(result.error);
  }
  
  return result;
}