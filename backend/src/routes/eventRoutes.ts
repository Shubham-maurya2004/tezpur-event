import { Router } from 'express';
import {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  enrollStudent,
  unenrollStudent,
  getEnrolledStudents,
  approveEvent,
  rejectEvent,
} from '../controllers/eventController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getEvents);
router.post('/', protect, adminOnly, createEvent);
router.get('/:id', getEventById);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.post('/:id/enroll', protect, enrollStudent);
router.post('/:id/unenroll', protect, unenrollStudent);
router.get('/:id/students', protect, getEnrolledStudents);
router.put('/:id/approve', protect, adminOnly, approveEvent);
router.put('/:id/reject', protect, adminOnly, rejectEvent);

export default router;
