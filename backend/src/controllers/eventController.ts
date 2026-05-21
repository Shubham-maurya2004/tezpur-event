import { Response } from 'express';
import Event from '../models/Event';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, status } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    const events = await Event.find(filter).populate('participants', 'name email studentId department year');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, eventType, description, venue, startDate, endDate, enrollmentDeadline, maxParticipants } = req.body;
    const event = await Event.create({
      name,
      category,
      eventType,
      description,
      venue,
      startDate,
      endDate,
      enrollmentDeadline,
      maxParticipants: maxParticipants || 50,
      createdBy: req.user?._id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).populate('participants', 'name email studentId department year');
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    const { name, category, eventType, description, venue, startDate, endDate, enrollmentDeadline, maxParticipants, status } = req.body;
    if (name) event.name = name;
    if (category) event.category = category;
    if (eventType) event.eventType = eventType;
    if (description) event.description = description;
    if (venue) event.venue = venue;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (enrollmentDeadline) event.enrollmentDeadline = enrollmentDeadline;
    if (maxParticipants !== undefined) event.maxParticipants = maxParticipants;
    if (status) event.status = status;
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const enrollStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    const userId = req.user?._id;
    if (event.enrollmentDeadline && new Date() > event.enrollmentDeadline) {
      res.status(400).json({ message: 'Enrollment deadline has passed' });
      return;
    }
    if (event.participants.some((p) => p.toString() === userId?.toString())) {
      res.status(400).json({ message: 'Already enrolled' });
      return;
    }
    if (event.participants.length >= event.maxParticipants) {
      res.status(400).json({ message: 'Event is full' });
      return;
    }
    event.participants.push(userId!);
    await event.save();
    const user = await User.findById(userId);
    if (user) {
      user.enrolledEvents.push(event._id);
      await user.save();
    }
    res.json({ message: 'Enrolled successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const unenrollStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    const userId = req.user?._id;
    event.participants = event.participants.filter((p) => p.toString() !== userId?.toString());
    await event.save();
    const user = await User.findById(userId);
    if (user) {
      user.enrolledEvents = user.enrolledEvents.filter((e) => e.toString() !== event._id.toString());
      await user.save();
    }
    res.json({ message: 'Unenrolled successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEnrolledStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).populate('participants', 'name email studentId department year phone');
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(event.participants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    event.status = 'upcoming';
    await event.save();
    res.json({ message: 'Event approved', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    event.status = 'cancelled';
    await event.save();
    res.json({ message: 'Event rejected', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
