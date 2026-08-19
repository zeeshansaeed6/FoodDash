// ============================================================
// FoodDash — Table Booking & Dine-in Reservation Routes
// ============================================================
import express from 'express';
import { db } from '../db.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/reservations/tables/:restaurantId
// Get restaurant floor plan layout and table availability for date & slot
router.get('/tables/:restaurantId', (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date, timeSlot } = req.query;

    const tables = db.getRestaurantTables(restaurantId, date || '', timeSlot || '');
    res.json({
      success: true,
      restaurantId: parseInt(restaurantId),
      date: date || 'today',
      timeSlot: timeSlot || 'now',
      tables,
      totalTables: tables.length,
      availableCount: tables.filter(t => t.isAvailable).length
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch table layouts' });
  }
});

// POST /api/reservations/book
// Create a new table reservation with optional pre-order dishes
router.post('/book', optionalAuth, (req, res) => {
  try {
    const {
      restaurantId,
      restaurantName,
      restaurantAddress,
      restaurantImage,
      date,
      timeSlot,
      guests,
      tableIds,
      tableNames,
      occasion,
      specialRequests,
      customerName,
      customerPhone,
      customerEmail,
      preOrderedItems,
      preOrderTotal,
      depositPaid
    } = req.body;

    if (!restaurantId || !date || !timeSlot || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Missing required reservation fields (restaurantId, date, timeSlot, guests)'
      });
    }

    const userId = req.user ? req.user.id : (req.body.userId || 'guest_' + Date.now());
    const finalName = customerName || (req.user ? req.user.name : 'Valued Guest');
    const finalPhone = customerPhone || (req.user ? req.user.phone : '');
    const finalEmail = customerEmail || (req.user ? req.user.email : '');

    const reservation = db.createReservation({
      userId,
      userKey: userId,
      restaurantId: parseInt(restaurantId),
      restaurantName: restaurantName || 'Partner Restaurant',
      restaurantAddress: restaurantAddress || 'Downtown Food Street',
      restaurantImage: restaurantImage || '',
      date,
      timeSlot,
      guests: parseInt(guests) || 2,
      tableIds: Array.isArray(tableIds) ? tableIds : (tableIds ? [tableIds] : ['T-1']),
      tableNames: tableNames || 'Window Table',
      occasion: occasion || 'Casual Dining',
      specialRequests: specialRequests || '',
      customerName: finalName,
      customerPhone: finalPhone,
      customerEmail: finalEmail,
      preOrderedItems: preOrderedItems || [],
      preOrderTotal: preOrderTotal || 0,
      depositPaid: depositPaid || 0
    });

    res.status(201).json({
      success: true,
      message: 'Table booked successfully! Your reservation pass is confirmed.',
      reservation
    });
  } catch (error) {
    console.error('Error creating table reservation:', error);
    res.status(500).json({ success: false, message: 'Failed to create reservation' });
  }
});

// GET /api/reservations/user
// Get current user's reservations
router.get('/user', optionalAuth, (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId;
    const phone = req.query.phone || (req.user ? req.user.phone : '');

    if (!userId && !phone) {
      // Return all guest reservations or empty list
      return res.json({ success: true, reservations: [] });
    }

    const reservations = db.getReservationsByUser(userId, phone);
    res.json({
      success: true,
      reservations
    });
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    res.status(500).json({ success: false, message: 'Failed to load reservations' });
  }
});

// GET /api/reservations/restaurant/:restaurantId
// Get all reservations for merchant/restaurant dashboard
router.get('/restaurant/:restaurantId', (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reservations = db.getReservationsByRestaurant(restaurantId);
    res.json({
      success: true,
      restaurantId: parseInt(restaurantId),
      reservations
    });
  } catch (error) {
    console.error('Error fetching restaurant reservations:', error);
    res.status(500).json({ success: false, message: 'Failed to load restaurant reservations' });
  }
});

// GET /api/reservations/:id
// Get details for a specific reservation
router.get('/:id', (req, res) => {
  try {
    const reservation = db.getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({ success: true, reservation });
  } catch (error) {
    console.error('Error fetching reservation by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reservation' });
  }
});

// PATCH /api/reservations/:id/cancel
// Cancel a reservation
router.patch('/:id/cancel', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const result = db.cancelReservation(id, reason);
    if (result.success) {
      res.json({ success: true, message: 'Reservation cancelled successfully', reservation: result.reservation });
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel reservation' });
  }
});

// PATCH /api/reservations/:id/status
// Update reservation status (seated, completed, confirmed, cancelled)
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const result = db.updateReservationStatus(id, status, note);
    if (result.success) {
      res.json({ success: true, message: `Reservation marked as ${status}`, reservation: result.reservation });
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

export default router;
