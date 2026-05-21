import { Router } from 'express';
import {
  getLiveScores,
  createLiveScore,
  getLiveScoreByEvent,
  updateLiveScore,
  deleteLiveScore,
} from '../controllers/liveScoreController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getLiveScores);
router.post('/', protect, adminOnly, createLiveScore);
router.get('/event/:eventId', getLiveScoreByEvent);
router.put('/:id', protect, adminOnly, updateLiveScore);
router.delete('/:id', protect, adminOnly, deleteLiveScore);

export default router;
