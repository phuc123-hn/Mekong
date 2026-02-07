import express from 'express';
import Joi from 'joi';
import { generateToken } from '../utils/jwt';
import { User, UserRole } from '../models/User';

const router = express.Router();

const phoneSchema = Joi.string()
  .pattern(/^0\d{9,10}$/)
  .required()
  .messages({ 'string.pattern.base': 'Invalid phone format (0xx xxxxxxx)' });

const passwordSchema = Joi.string().min(8).required();

// Role mapping: tiếng Việt → enum
const roleMap: Record<string, UserRole> = {
  'Nông dân': 'FARMER',
  'Chính quyền': 'GOVERNMENT',
  'FARMER': 'FARMER',
  'GOVERNMENT': 'GOVERNMENT',
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    console.log('📥 Register request received:', req.body); // DEBUG
    let { phone, password, fullName, role } = req.body;

    // Normalize phone: trim whitespace
    phone = phone?.trim();
    
    const phoneError = phoneSchema.validate(phone).error;
    if (phoneError) return res.status(400).json({ error: phoneError.message });

    const passwordError = passwordSchema.validate(password).error;
    if (passwordError) return res.status(400).json({ error: 'Password must be ≥ 8 chars' });

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    // Normalize role: Nông dân → FARMER, Chính quyền → GOVERNMENT
    const normalizedRole = roleMap[role] || 'FARMER';

    // Create new user
    const newUser = new User({
      phone,
      password_hash: password, // Will be hashed by pre-save hook
      fullName: fullName || 'User',
      role: normalizedRole,
    });

    await newUser.save();

    const token = generateToken(newUser._id.toString(), newUser.role);
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        role: newUser.role,
        phone: newUser.phone,
        fullName: newUser.fullName,
      },
    });
  } catch (err: any) {
    console.error('❌ REGISTER ERROR DETAIL:', err);
    
    // Xử lý từng loại lỗi cụ thể
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: `VALIDATION_ERROR: ${err.message}` });
    }
    
    if (err.code === 11000) {
      // E11000 duplicate key error
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ error: `DUPLICATE_KEY: ${field} already exists` });
    }
    
    if (err.name === 'MongoServerError') {
      return res.status(500).json({ error: `MONGO_ERROR: ${err.message}` });
    }
    
    // Generic error
    res.status(500).json({ error: 'REGISTRATION_FAILED', details: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    // 🔍 DEBUG LOG 3 DÒ (BẮTLUNG THỦ 400)
    console.log('📥 LOGIN RAW BODY:', req.body);
    console.log('📥 LOGIN PHONE TYPE:', typeof req.body.phone);
    console.log('📥 LOGIN PHONE VALUE:', JSON.stringify(req.body.phone));

    // Normalize phone: trim + convert to string
    let phone = String(req.body.phone || '').trim();
    const password = req.body.password;

    console.log('📥 LOGIN NORMALIZED PHONE:', phone);

    const phoneError = phoneSchema.validate(phone).error;
    if (phoneError) {
      console.warn('❌ LOGIN PHONE INVALID:', phone, 'Error:', phoneError.message);
      return res.status(400).json({ error: phoneError.message });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }

    const token = generateToken(user._id.toString(), user.role);
    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        phone: user.phone,
        fullName: user.fullName,
      },
    });
  } catch (err: any) {
    console.error('❌ LOGIN ERROR DETAIL:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: `VALIDATION_ERROR: ${err.message}` });
    }
    
    if (err.name === 'MongoServerError') {
      return res.status(500).json({ error: `MONGO_ERROR: ${err.message}` });
    }
    
    res.status(500).json({ error: 'LOGIN_FAILED', details: err.message });
  }
});

export default router;
