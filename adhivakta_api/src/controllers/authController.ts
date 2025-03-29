import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import admin from '../config/firebase';
import User from '../models/User';
import logger from '../utils/logger';

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { token, name, role, phone, specialization } = req.body;

    if (!token || !name || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      logger.warn(`User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate role
    if (!['client', 'associate', 'lawyer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Create new user
    const newUser = new User({
      uid,
      email,
      name,
      role,
      phone,
      specialization: role === 'lawyer' ? specialization : undefined,
    });

    await newUser.save();

    // Generate JWT
    const jwtToken = generateToken(newUser);

    logger.info(`New user registered: ${email}`);
    res.status(201).json({ token: jwtToken, user: newUser });
  } catch (error: any) {
    logger.error(`Signup error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Firebase token is required' });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;

    // Find user
    const user = await User.findOne({ uid });
    if (!user) {
      logger.warn(`Login attempt for non-existent user: ${uid}`);
      return res.status(404).json({ message: 'User not found. Please sign up.' });
    }

    // Generate JWT
    const jwtToken = generateToken(user);

    logger.info(`User logged in: ${user.email}`);
    res.status(200).json({ token: jwtToken, user });
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-__v');
    if (!user) {
      logger.warn(`Profile not found for user ID: ${req.user?.id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    logger.error(`Get profile error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newToken = generateToken(user);
    res.status(200).json({ token: newToken });
  } catch (error: any) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Add new social login handler
export const socialLogin = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
  
      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, email, name } = decodedToken;
  
      // Add email validation
      if (!email) {
        return res.status(400).json({ message: 'Email not found in token' });
      }
  
      // Find or create user
      let user = await User.findOne({ uid });
      
      if (!user) {
        // Create new user with default 'client' role
        user = new User({
          uid,
          email, // Now validated
          name: name || email.split('@')[0], // Use validated email
          role: 'client'
        });
  
        await user.save();
        logger.info(`New social user created: ${email}`);
      }
  
    } catch (error: any) {
      logger.error(`Social login error: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  };
  