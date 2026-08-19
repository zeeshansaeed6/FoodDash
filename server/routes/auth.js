// ============================================================
// Auth Router — Phone OTP, Google Login, Email Auth
// ============================================================
import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Send Phone OTP
router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number' });
  }

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  db.saveOTP(cleanPhone, otp);

  console.log(`📱 [SMS Gateway Simulator] OTP for +91-${cleanPhone} is: ${otp} (or test code '1234')`);

  return res.json({
    success: true,
    message: `OTP sent successfully to +91-${cleanPhone}`,
    phone: cleanPhone,
    // Provide in response for instant developer testing
    devOtp: otp
  });
});

// 2. Verify Phone OTP & Sign In / Register
router.post('/verify-otp', (req, res) => {
  const { phone, otp, name } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
  }

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const isValid = db.verifyOTP(cleanPhone, otp.trim());

  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please try again.' });
  }

  let user = db.findUserByPhone(cleanPhone);
  if (!user) {
    user = db.createUser({
      phone: cleanPhone,
      name: name || `Foodie +91${cleanPhone.slice(-4)}`,
      avatar: '🥑'
    });
  }

  const token = generateToken(user);
  return res.json({
    success: true,
    message: 'Signed in successfully!',
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar
    }
  });
});

// 3. Google Sign-In
router.post('/google', (req, res) => {
  const { email, name, googleId, avatar } = req.body;
  const userEmail = email || `user_${Date.now()}@gmail.com`;
  const userName = name || 'Google User';

  let user = db.findUserByEmail(userEmail);
  if (!user) {
    user = db.createUser({
      email: userEmail,
      name: userName,
      googleId: googleId || 'google_mock_id',
      avatar: avatar || '🧑‍🍳'
    });
  } else {
    if (avatar) db.updateUser(user.id, { avatar });
  }

  const token = generateToken(user);
  return res.json({
    success: true,
    message: `Welcome, ${user.name}! Signed in via Google.`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar
    }
  });
});

// 4. Email & Password Registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Email and password (min 6 chars) are required' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = db.createUser({
    name: name || email.split('@')[0],
    email,
    password: hashedPassword,
    avatar: '👨‍🍳'
  });

  const token = generateToken(user);
  return res.json({
    success: true,
    message: 'Account created successfully!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    }
  });
});

// 5. Email & Password Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = db.findUserByEmail(email);
  if (!user || !user.password) {
    return res.status(400).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Invalid email or password' });
  }

  const token = generateToken(user);
  return res.json({
    success: true,
    message: 'Logged in successfully!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar
    }
  });
});

// 6. Get Current Profile
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      avatar: req.user.avatar,
      addresses: req.user.addresses || [],
      settings: req.user.settings || { vegOnly: false, notifications: true, smsUpdates: true, darkMode: true },
      favorites: req.user.favorites || []
    }
  });
});

// 7. Update Profile (Name, Email, Phone, Avatar)
router.put('/profile', requireAuth, (req, res) => {
  const { name, email, phone, avatar } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (email !== undefined) updates.email = email.trim();
  if (phone !== undefined) updates.phone = phone.replace(/\D/g, '').slice(-10);
  if (avatar !== undefined) updates.avatar = avatar;

  const updated = db.updateUser(req.user.id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({
    success: true,
    message: 'Profile updated successfully!',
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      avatar: updated.avatar,
      addresses: updated.addresses || [],
      settings: updated.settings || {},
      favorites: updated.favorites || []
    }
  });
});

// 8. Add Saved Address
router.post('/addresses', requireAuth, (req, res) => {
  const { label, houseNo, street, area, city, pincode, landmark, phone, isDefault } = req.body;
  if (!houseNo && !street && !area) {
    return res.status(400).json({ success: false, message: 'Please provide complete address details' });
  }

  const newAddress = db.addAddress(req.user.id, {
    label: label || 'Home',
    houseNo,
    street,
    area,
    city: city || 'Bangalore',
    pincode,
    landmark,
    phone: phone || req.user.phone,
    isDefault
  });

  if (!newAddress) {
    return res.status(500).json({ success: false, message: 'Failed to save address' });
  }

  const updatedUser = db.findUserById(req.user.id);
  return res.status(201).json({
    success: true,
    message: 'Address saved successfully!',
    address: newAddress,
    addresses: updatedUser.addresses
  });
});

// 9. Update Saved Address
router.put('/addresses/:id', requireAuth, (req, res) => {
  const updated = db.updateAddress(req.user.id, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }

  const updatedUser = db.findUserById(req.user.id);
  return res.json({
    success: true,
    message: 'Address updated successfully!',
    address: updated,
    addresses: updatedUser.addresses
  });
});

// 10. Delete Saved Address
router.delete('/addresses/:id', requireAuth, (req, res) => {
  const ok = db.deleteAddress(req.user.id, req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }

  const updatedUser = db.findUserById(req.user.id);
  return res.json({
    success: true,
    message: 'Address removed successfully',
    addresses: updatedUser.addresses
  });
});

// 11. Update User Settings & Preferences
router.put('/settings', requireAuth, (req, res) => {
  const updatedSettings = db.updateSettings(req.user.id, req.body);
  return res.json({
    success: true,
    message: 'Preferences saved!',
    settings: updatedSettings
  });
});

// 12. Logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
