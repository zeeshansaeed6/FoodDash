// ============================================================
// FoodDash — Payments Gateway Mock API
// ============================================================
import express from 'express';

const router = express.Router();

// 1. POST /api/payments/intent - Create a payment intent (Mock Stripe)
router.post('/intent', (req, res) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;
    
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    // Mocking a Stripe-like Client Secret
    const clientSecret = `pi_mock_${Math.random().toString(36).substring(2, 15)}_secret_${Date.now()}`;

    res.json({
      success: true,
      clientSecret,
      transactionId: `txn_${Date.now()}`,
      amount,
      currency
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ success: false, message: 'Failed to initialize payment gateway' });
  }
});

// 2. POST /api/payments/webhook - Webhook endpoint for async payment completion
router.post('/webhook', (req, res) => {
  try {
    const { eventType, transactionId, status } = req.body;
    
    console.log(`[Webhook received] Event: ${eventType}, Txn: ${transactionId}, Status: ${status}`);

    // In a real app, we'd verify the Stripe signature here and update the DB order status
    
    res.json({ success: true, message: 'Webhook processed' });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

export default router;
