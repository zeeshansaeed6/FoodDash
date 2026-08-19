// ============================================================
// User Router — Profile, Favorites & Saved Addresses
// ============================================================
import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Get Favorites
router.get('/favorites', requireAuth, (req, res) => {
  res.json({
    success: true,
    favorites: req.user.favorites || []
  });
});

// 2. Toggle Favorite
router.post('/favorites/toggle', requireAuth, (req, res) => {
  const { restaurantId } = req.body;
  if (!restaurantId) {
    return res.status(400).json({ success: false, message: 'restaurantId required' });
  }

  let favs = req.user.favorites || [];
  const idNum = parseInt(restaurantId);
  const exists = favs.includes(idNum);

  if (exists) {
    favs = favs.filter(id => id !== idNum);
  } else {
    favs.push(idNum);
  }

  db.updateUser(req.user.id, { favorites: favs });

  res.json({
    success: true,
    isFavorite: !exists,
    favorites: favs
  });
});

// 3. Get Saved Addresses
router.get('/addresses', requireAuth, (req, res) => {
  res.json({
    success: true,
    addresses: req.user.addresses || []
  });
});

// 4. Add Saved Address
router.post('/addresses', requireAuth, (req, res) => {
  const { label, address, area, city, pin } = req.body;
  if (!address) {
    return res.status(400).json({ success: false, message: 'Address is required' });
  }

  const addresses = req.user.addresses || [];
  const newAddr = {
    id: `addr_${Date.now()}`,
    label: label || 'Home',
    address,
    area: area || '',
    city: city || 'Bangalore',
    pin: pin || ''
  };

  addresses.push(newAddr);
  db.updateUser(req.user.id, { addresses });

  res.status(201).json({
    success: true,
    message: 'Address saved successfully',
    addresses
  });
});

export default router;
