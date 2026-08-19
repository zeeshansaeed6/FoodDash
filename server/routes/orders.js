// ============================================================
// Orders Router — Order Placement & Live Tracking Engine
// ============================================================
import express from 'express';
import { db } from '../db.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Create New Order
router.post('/', optionalAuth, (req, res) => {
  const {
    restaurantId,
    restaurantName,
    restaurantAddress,
    restaurantLocation,
    cityName,
    items,
    itemTotal,
    deliveryFee,
    tax,
    platformFee,
    tip,
    discount,
    grandTotal,
    deliveryAddress,
    customerLocation,
    deliveryInstruction,
    paymentMethod
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cannot place empty order' });
  }

  const userId = req.user ? req.user.id : (req.body.userId || `guest_${Date.now()}`);
  const userName = req.user ? req.user.name : (req.body.userName || 'Valued Customer');
  const userPhone = req.user ? req.user.phone : (req.body.userPhone || '+91 98765 00000');
  const userEmail = req.user ? req.user.email : (req.body.userEmail || '');

  const order = db.createOrder({
    userId,
    userName,
    userPhone,
    userEmail,
    restaurantId: restaurantId || 1,
    restaurantName: restaurantName || 'Spice Garden',
    restaurantAddress: restaurantAddress || '',
    restaurantLocation: restaurantLocation || null,
    cityName: cityName || 'Bangalore',
    items,
    bill: {
      itemTotal: itemTotal || 0,
      deliveryFee: deliveryFee || 0,
      tax: tax || 0,
      platformFee: platformFee || 6,
      tip: tip || 0,
      discount: discount || 0,
      grandTotal: grandTotal || 0
    },
    deliveryAddress: deliveryAddress || 'Current Location',
    customerLocation: customerLocation || null,
    deliveryInstruction: deliveryInstruction || 'Leave at door',
    paymentMethod: paymentMethod || 'upi',
    estimatedDeliveryMins: 25,
    driver: {
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      rating: 4.9,
      vehicle: 'Hero Electric (KA-01-FD-2026)'
    }
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    order
  });
});

// 2. Get User's Order History
router.get('/', requireAuth, (req, res) => {
  const orders = db.getOrdersByUser(req.user.id);
  res.json({
    success: true,
    count: orders.length,
    orders
  });
});

// 3. Merchant: Get All Live Orders (For Restaurant Kitchen Dashboard)
router.get('/merchant/all', (req, res) => {
  const orders = db.getAllOrders();
  res.json({
    success: true,
    count: orders.length,
    orders
  });
});

// 4. Merchant: Update Kitchen Order Status
router.put('/:id/status', (req, res) => {
  const { status, note } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status, note);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    order: updated
  });
});

// 5. Delivery Partner: Get Live Available Deliveries Feed
router.get('/delivery/feed', (req, res) => {
  const all = db.getAllOrders();
  res.json({
    success: true,
    count: all.length,
    orders: all
  });
});

// 6. Delivery Partner: Accept / Pickup / Complete Delivery Action
router.put('/:id/delivery-action', (req, res) => {
  const { action, driverName, driverPhone } = req.body;
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  let newStatus = order.status;
  let note = '';

  if (action === 'accept') {
    newStatus = 'rider_assigned';
    note = `Delivery accepted by partner ${driverName || 'Ramesh'}`;
    order.driver = {
      name: driverName || 'Ramesh Kumar',
      phone: driverPhone || '+91 98765 43210',
      rating: 4.9,
      vehicle: 'Hero Electric (KA-01-FD-2026)'
    };
  } else if (action === 'pickup') {
    newStatus = 'out_for_delivery';
    note = 'Order picked up from restaurant kitchen. On the way!';
  } else if (action === 'deliver') {
    newStatus = 'delivered';
    note = 'Order successfully delivered to customer doorstep!';
  }

  const updated = db.updateOrderStatus(req.params.id, newStatus, note);
  res.json({
    success: true,
    message: note,
    order: updated
  });
});

// 7. Delivery Partner: Broadcast Real-Time GPS Coordinates
router.put('/:id/driver-location', (req, res) => {
  const { lat, lng, speed = 28, heading = 0 } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'Missing lat/lng coordinates' });
  }
  const updatedLocation = db.updateDriverLocation(req.params.id, { lat, lng, speed, heading });
  if (!updatedLocation) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({
    success: true,
    message: 'Driver location updated in real-time',
    driverLocation: updatedLocation
  });
});

// 8. Live Order Tracking Status with High-Definition Real-Time Telemetry
router.get('/:id/track', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Calculate simulated progression based on elapsed time since order creation
  const elapsedSeconds = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  let status = order.status || 'confirmed';
  let activeStep = 0;
  let etaMins = Math.max(1, Math.round(25 - (elapsedSeconds / 60)));

  if (status === 'delivered' || elapsedSeconds > 180) {
    status = 'delivered';
    activeStep = 3;
    etaMins = 0;
  } else if (status === 'out_for_delivery' || elapsedSeconds > 75) {
    status = 'out_for_delivery';
    activeStep = 2;
  } else if (status === 'rider_assigned' || elapsedSeconds > 40) {
    status = 'rider_assigned';
    activeStep = 2;
  } else if (status === 'preparing' || elapsedSeconds > 15) {
    status = 'preparing';
    activeStep = 1;
  }

  // Coordinates resolution
  const restLoc = order.restaurantLocation || { lat: 12.9352, lng: 77.6245, address: order.restaurantName };
  const custLoc = order.customerLocation || { lat: 12.9279, lng: 77.6271, address: order.deliveryAddress };

  // Calculate high-resolution path waypoints (simulating real road curves)
  const waypoints = [
    { lat: restLoc.lat, lng: restLoc.lng, name: order.restaurantName },
    { lat: restLoc.lat + (custLoc.lat - restLoc.lat) * 0.3 + 0.0012, lng: restLoc.lng + (custLoc.lng - restLoc.lng) * 0.25 - 0.0008 },
    { lat: restLoc.lat + (custLoc.lat - restLoc.lat) * 0.65 - 0.0009, lng: restLoc.lng + (custLoc.lng - restLoc.lng) * 0.7 + 0.0011 },
    { lat: custLoc.lat, lng: custLoc.lng, name: 'Delivery Location' }
  ];

  // Dynamic rider position interpolation if not manually broadcasted
  let progressRatio = 0;
  if (status === 'delivered') progressRatio = 1.0;
  else if (status === 'out_for_delivery') {
    // 75s to 180s = progress from 0.0 to 1.0
    progressRatio = Math.min(0.95, Math.max(0.05, (elapsedSeconds - 75) / 105));
  } else if (status === 'rider_assigned') {
    progressRatio = 0.05;
  }

  // Interpolate along waypoints
  const totalSegments = waypoints.length - 1;
  const currentSegment = Math.min(totalSegments - 1, Math.floor(progressRatio * totalSegments));
  const segmentRatio = (progressRatio * totalSegments) - currentSegment;

  const p1 = waypoints[currentSegment];
  const p2 = waypoints[currentSegment + 1];

  const currentLat = Number((p1.lat + (p2.lat - p1.lat) * segmentRatio).toFixed(6));
  const currentLng = Number((p1.lng + (p2.lng - p1.lng) * segmentRatio).toFixed(6));

  // Compute bearing/heading angle in degrees
  const dLng = (p2.lng - p1.lng) * (Math.PI / 180);
  const lat1Rad = p1.lat * (Math.PI / 180);
  const lat2Rad = p2.lat * (Math.PI / 180);
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  const headingDeg = Math.round(((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360);

  // Distance calculation (Haversine approx)
  const remainingLat = (custLoc.lat - currentLat) * 111;
  const remainingLng = (custLoc.lng - currentLng) * 111 * Math.cos(currentLat * Math.PI / 180);
  const distanceRemainingKm = Number(Math.max(0.05, Math.sqrt(remainingLat * remainingLat + remainingLng * remainingLng)).toFixed(2));
  const speedKmh = status === 'out_for_delivery' ? Math.round(28 + Math.sin(elapsedSeconds) * 8) : (status === 'delivered' ? 0 : 18);

  const driverLoc = order.driverLocation || {
    lat: currentLat,
    lng: currentLng,
    speed: speedKmh,
    heading: headingDeg,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    orderId: order.id,
    restaurantName: order.restaurantName,
    status,
    activeStep,
    etaMins: status === 'delivered' ? 0 : etaMins,
    distanceRemainingKm: status === 'delivered' ? 0 : distanceRemainingKm,
    speedKmh,
    headingDeg,
    progressRatio: Number((progressRatio * 100).toFixed(1)),
    restaurantLocation: restLoc,
    customerLocation: custLoc,
    driverLocation: driverLoc,
    waypoints,
    driver: order.driver,
    steps: [
      { id: 0, label: 'Order Confirmed', time: 'Just now', completed: activeStep >= 0 },
      { id: 1, label: 'Kitchen Preparing Your Feast', time: '~5 mins', completed: activeStep >= 1 },
      { id: 2, label: 'Valet On the Way with GPS Live', time: '~15 mins', completed: activeStep >= 2 },
      { id: 3, label: 'Delivered at Doorstep', time: '~25 mins', completed: activeStep >= 3 },
    ]
  });
});

// 9. Get Specific Order Details
router.get('/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// 7. Promos: Get active promo coupons
router.get('/meta/promos', (req, res) => {
  const promos = [
    { code: 'WELCOME50', title: 'Flat ₹50 OFF', desc: 'On orders above ₹199', discount: 50, minOrder: 199 },
    { code: 'TASTY20', title: '20% OFF up to ₹120', desc: 'On orders above ₹250', discountPercent: 20, maxDiscount: 120, minOrder: 250 },
    { code: 'FREEDEL', title: 'Free Delivery', desc: 'Free delivery on orders above ₹199', discount: 25, minOrder: 199 },
    { code: 'PARTY40', title: '40% OFF up to ₹200', desc: 'On party orders above ₹599', discountPercent: 40, maxDiscount: 200, minOrder: 599 },
    { code: 'FLAT100', title: 'Flat ₹100 OFF', desc: 'Special weekend deal on orders above ₹399', discount: 100, minOrder: 399 }
  ];
  res.json({ success: true, promos });
});

// 8. Promos: Validate & Apply Promo
router.post('/meta/promos/apply', (req, res) => {
  const { code, itemTotal } = req.body;
  const subtotal = parseInt(itemTotal) || 0;
  const upperCode = (code || '').toUpperCase().trim();

  const promos = {
    'WELCOME50': { discount: 50, minOrder: 199, desc: 'Flat ₹50 OFF' },
    'TASTY20': { discount: Math.min(120, Math.round(subtotal * 0.20)), minOrder: 250, desc: '20% OFF' },
    'FREEDEL': { discount: 25, minOrder: 199, desc: 'Free Delivery (₹25 OFF)' },
    'PARTY40': { discount: Math.min(200, Math.round(subtotal * 0.40)), minOrder: 599, desc: '40% OFF' },
    'FLAT100': { discount: 100, minOrder: 399, desc: 'Flat ₹100 OFF' }
  };

  const promo = promos[upperCode];
  if (!promo) {
    return res.status(400).json({ success: false, message: `Invalid coupon code "${upperCode}"` });
  }

  if (subtotal < promo.minOrder) {
    return res.status(400).json({
      success: false,
      message: `Coupon "${upperCode}" requires minimum cart value of ₹${promo.minOrder} (Add ₹${promo.minOrder - subtotal} more)`
    });
  }

  res.json({
    success: true,
    code: upperCode,
    discount: promo.discount,
    message: `🎉 Coupon "${upperCode}" applied! You saved ₹${promo.discount}`
  });
});

// 9. AI Foodie Support Chatbot
router.post('/support/chat', (req, res) => {
  const { message, activeOrderId } = req.body;
  const q = (message || '').toLowerCase();

  let reply = "Hello! I am your FoodDash Assistant. How can I help you today? You can ask about order status, refunds, delivery speed, or discounts!";

  if (q.includes('track') || q.includes('status') || q.includes('where is my order') || q.includes('order')) {
    if (activeOrderId) {
      const ord = db.getOrderById(activeOrderId);
      if (ord) {
        reply = `Order **${ord.id}** from **${ord.restaurantName}** is currently **${ord.status.toUpperCase()}**. Estimated delivery in ~${ord.estimatedDeliveryMins || 20} mins by driver ${ord.driver?.name || 'Ramesh'}.`;
      } else {
        reply = "You can view and track your live order progress under 'My Orders' in the profile menu!";
      }
    } else {
      const all = db.getAllOrders();
      if (all.length > 0) {
        const latest = all[0];
        reply = `Your latest order **${latest.id}** is currently **${latest.status.toUpperCase()}**! Our delivery partner is on the way.`;
      } else {
        reply = "You don't have any active orders right now. Pick your favorite restaurant and place an order to track live!";
      }
    }
  } else if (q.includes('cancel') || q.includes('refund')) {
    reply = "To request a cancellation or instant refund, we ensure 100% money back to your original payment method within 15 minutes if the restaurant hasn't started cooking yet!";
  } else if (q.includes('coupon') || q.includes('discount') || q.includes('offer')) {
    reply = "🌟 Today's best codes: Use **WELCOME50** for ₹50 OFF, **TASTY20** for 20% OFF, or **PARTY40** for ₹200 OFF on party orders!";
  } else if (q.includes('rider') || q.includes('driver') || q.includes('call')) {
    reply = "Your delivery partner will call you upon arrival at your doorstep. You can also specify delivery notes like 'Leave at door' in the cart!";
  } else if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
    reply = "Hey there! 🍔 Hungry? Check out top trending restaurants or ask me anything about your orders and delivery!";
  }

  res.json({
    success: true,
    reply,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
});

export default router;
