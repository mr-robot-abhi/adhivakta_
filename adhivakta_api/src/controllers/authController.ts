import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import admin from '../config/firebase';
import User from '../models/User';
import logger from '../utils/logger';

// Type definitions
interface IDecodedToken {
  uid: string;
  email: string;
  name?: string;
}

interface IUserRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const generateToken = (user: { _id: string; role: string }) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { token, name, role, phone, specialization } = req.body;

    // Validate required fields
    if (!token || !name || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken as IDecodedToken;

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ uid }, { email }] });
    if (existingUser) {
      logger.warn(`User already exists: ${email}`);
      return res.status(409).json({ message: 'User already exists' });
    }

    // Validate role
    const validRoles = ['client', 'associate', 'lawyer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role specified',
        validRoles
      });
    }

    // Create new user
    const userData = {
      uid,
      email,
      name,
      role,
      phone,
      ...(role === 'lawyer' && { specialization })
    };

    const newUser = await User.create(userData);

    // Generate JWT
    const jwtToken = generateToken(newUser);

    logger.info(`New user registered: ${email}`);
    res.status(201).json({ 
      token: jwtToken, 
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        specialization: newUser.specialization
      }
    });

  } catch (error: any) {
    logger.error(`Signup error: ${error.message}`);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Firebase token expired' });
    }
    
    res.status(500).json({ 
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    const { uid, email } = decodedToken as IDecodedToken;

    // Find user
    const user = await User.findOne({ uid });
    if (!user) {
      logger.warn(`Login attempt for non-existent user: ${email}`);
      return res.status(404).json({ 
        message: 'User not found. Please sign up.',
        requiresSignup: true
      });
    }

    // Generate JWT
    const jwtToken = generateToken(user);

    logger.info(`User logged in: ${email}`);
    res.status(200).json({ 
      token: jwtToken, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization
      }
    });

  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Firebase token expired' });
    }
    
    res.status(500).json({ 
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getProfile = async (req: IUserRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id)
      .select('-__v -createdAt -updatedAt -password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    logger.error(`Get profile error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
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
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const socialLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken as IDecodedToken;

    if (!email) {
      return res.status(400).json({ message: 'Email not found in token' });
    }

    let user = await User.findOne({ uid });
    
    if (!user) {
      user = await User.create({
        uid,
        email,
        name: name || email.split('@')[0],
        role: 'client'
      });
      logger.info(`New social user created: ${email}`);
    }

    const jwtToken = generateToken(user);
    
    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error: any) {
    logger.error(`Social login error: ${error.message}`);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ 
      message: 'Social login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};