import { Request, Response } from 'express';
import User from '../models/User';
import Otp from '../models/Otp';
import generateToken from '../utils/generateToken';
import sendEmail from '../utils/sendEmail';
import { AuthRequest } from '../middleware/auth';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, studentId, department, year, phone, uniqueId, photo } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      studentId,
      uniqueId,
      photo,
      department,
      year,
      phone,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      uniqueId: user.uniqueId,
      photo: user.photo,
      department: user.department,
      year: user.year,
      phone: user.phone,
      approvalStatus: user.approvalStatus,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      res.status(400).json({ message: messages.join('. ') });
      return;
    }
    if (error.code === 11000) {
      res.status(400).json({ message: 'Duplicate field value' });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (role && user.role !== role) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      uniqueId: user.uniqueId,
      photo: user.photo,
      department: user.department,
      year: user.year,
      phone: user.phone,
      approvalStatus: user.approvalStatus,
      enrolledEvents: user.enrolledEvents,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'No account found with this email' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    await sendEmail(
      email,
      'Password Reset OTP',
      `<p>Your OTP for password reset is: <b>${otp}</b></p><p>This OTP expires in 10 minutes.</p>`
    );

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    const record = await Otp.findOne({ email, otp });
    if (!record) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }
    if (new Date() > record.expiresAt) {
      await Otp.deleteOne({ _id: record._id });
      res.status(400).json({ message: 'OTP has expired' });
      return;
    }

    res.json({ message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      res.status(400).json({ message: 'Email, OTP, and new password are required' });
      return;
    }

    const record = await Otp.findOne({ email, otp });
    if (!record) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }
    if (new Date() > record.expiresAt) {
      await Otp.deleteOne({ _id: record._id });
      res.status(400).json({ message: 'OTP has expired' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.password = password;
    await user.save();
    await Otp.deleteMany({ email });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        uniqueId: user.uniqueId,
        photo: user.photo,
        department: user.department,
        year: user.year,
        phone: user.phone,
        approvalStatus: user.approvalStatus,
        enrolledEvents: user.enrolledEvents,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name = req.body.name || user.name;
    user.studentId = req.body.studentId || user.studentId;
    user.department = req.body.department || user.department;
    user.year = req.body.year || user.year;
    user.phone = req.body.phone || user.phone;
    if (req.body.photo) user.photo = req.body.photo;
    if (req.body.email) user.email = req.body.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      studentId: updatedUser.studentId,
      uniqueId: updatedUser.uniqueId,
      photo: updatedUser.photo,
      department: updatedUser.department,
      year: updatedUser.year,
      phone: updatedUser.phone,
      approvalStatus: updatedUser.approvalStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserApproval = async (req: Request, res: Response): Promise<void> => {
  try {
    const { approvalStatus } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.approvalStatus = approvalStatus;
    await user.save();
    res.json({ message: `User ${approvalStatus}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
