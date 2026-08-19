// ============================================================
// FoodDash — Delivery Partner & Rider Fleet Routes
// ============================================================
import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// 1. GET /api/drivers - Fetch all registered riders / fleet directory
router.get('/', (req, res) => {
  try {
    const { city } = req.query;
    let drivers = db.getAllDrivers();
    if (city) {
      drivers = drivers.filter(d => d.city?.toLowerCase() === city.toLowerCase());
    }
    res.json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (err) {
    console.error('Error fetching drivers:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch driver fleet' });
  }
});

// 2. POST /api/drivers/register - Register a new delivery rider
router.post('/register', (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      city,
      zone,
      vehicleType,
      vehicleNumber,
      licenseNumber,
      avatar
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone Number are required' });
    }

    const newDriver = db.registerDriver({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      city: city || 'Bangalore',
      zone: zone || `${city || 'Bangalore'} Central Hub`,
      vehicleType: vehicleType || 'Electric Scooter',
      vehicleNumber: vehicleNumber || 'KA-01-FD-2026',
      licenseNumber: licenseNumber || 'DL9999999999',
      avatar: avatar || '🛵'
    });

    res.status(201).json({
      success: true,
      message: `Welcome to the FoodDash Fleet, ${newDriver.name}! ₹500 Onboarding bonus credited.`,
      driver: newDriver
    });
  } catch (err) {
    console.error('Error registering driver:', err);
    res.status(500).json({ success: false, message: 'Failed to register delivery rider' });
  }
});

// 3. GET /api/drivers/:id - Get specific driver profile
router.get('/:id', (req, res) => {
  try {
    const driver = db.getDriverById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    res.json({ success: true, driver });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve driver profile' });
  }
});

// 4. PUT /api/drivers/:id/status - Toggle driver duty status (online / offline)
router.put('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateDriverStatus(req.params.id, status || 'online');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    res.json({
      success: true,
      message: `Duty status updated to ${status}`,
      driver: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update duty status' });
  }
});

// 5. POST /api/drivers/:id/earnings - Add trip payout
router.post('/:id/earnings', (req, res) => {
  try {
    const { amount = 60 } = req.body;
    const updated = db.addDriverEarnings(req.params.id, amount);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    res.json({
      success: true,
      message: `₹${amount} payout added to driver balance`,
      driver: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record earnings' });
  }
});

export default router;
