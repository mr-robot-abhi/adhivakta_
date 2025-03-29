import { Request, Response } from 'express';
import User from '../models/User';
import Case from '../models/Case';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
    user?: {
      id: string;
      role: string;
    };
  }

export const createClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    const newClient = new User({
      name,
      email,
      phone,
      address,
      role: 'client'
    });

    await newClient.save();

    res.status(201).json({
      success: true,
      data: {
        id: newClient._id,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone
      }
    });
  } catch (error: any) {
    logger.error(`Client creation failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getClientProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = req.params.id;
    const requestingUser = req.user;

    // Clients can only view their own profile unless admin/lawyer
    if (requestingUser?.role === 'client' && requestingUser.id !== clientId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const client = await User.findById(clientId)
      .select('-password -__v')
      .lean();

    if (!client || client.role !== 'client') {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error: any) {
    logger.error(`Failed to fetch client profile: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateClientProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = req.params.id;
    const requestingUser = req.user;
    const updates = req.body;

    // Clients can only update their own profile unless admin
    if (requestingUser?.role === 'client' && requestingUser.id !== clientId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Prevent role changing
    if (updates.role) {
      delete updates.role;
    }

    const updatedClient = await User.findByIdAndUpdate(
      clientId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({
      success: true,
      data: updatedClient
    });
  } catch (error: any) {
    logger.error(`Failed to update client: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getClientCases = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = req.params.id;
    const requestingUser = req.user;

    // Clients can only view their own cases unless admin/lawyer
    if (requestingUser?.role === 'client' && requestingUser.id !== clientId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const cases = await Case.find({ client: clientId })
      .populate('lawyers', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error: any) {
    logger.error(`Failed to fetch client cases: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const searchClients = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || query.toString().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const clients = await User.find({
      role: 'client',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name email phone')
    .limit(10)
    .lean();

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error: any) {
    logger.error(`Client search failed: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};