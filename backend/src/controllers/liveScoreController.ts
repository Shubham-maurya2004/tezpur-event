import { Response } from 'express';
import LiveScore from '../models/LiveScore';
import { AuthRequest } from '../middleware/auth';

export const getLiveScores = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const scores = await LiveScore.find({}).populate('team1.players team2.players individualScores.studentId', 'name studentId');
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createLiveScore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId, eventName, matchTitle, team1, team2, individualScores, currentStatus } = req.body;
    const score = await LiveScore.create({
      eventId,
      eventName,
      matchTitle,
      team1,
      team2,
      individualScores,
      currentStatus: currentStatus || 'ongoing',
      updatedBy: req.user?._id,
    });
    res.status(201).json(score);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLiveScoreByEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const score = await LiveScore.findOne({ eventId: req.params.eventId }).populate(
      'team1.players team2.players individualScores.studentId',
      'name studentId'
    );
    if (!score) {
      res.status(404).json({ message: 'Score not found' });
      return;
    }
    res.json(score);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLiveScore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const score = await LiveScore.findById(req.params.id);
    if (!score) {
      res.status(404).json({ message: 'Score not found' });
      return;
    }
    const { matchTitle, team1, team2, individualScores, currentStatus } = req.body;
    if (matchTitle) score.matchTitle = matchTitle;
    if (team1) score.team1 = { ...score.team1, ...team1 };
    if (team2) score.team2 = { ...score.team2, ...team2 };
    if (individualScores) score.individualScores = individualScores;
    if (currentStatus) score.currentStatus = currentStatus;
    score.lastUpdated = new Date();
   score.updatedBy = req.user!._id;
    const updatedScore = await score.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('scoreUpdated', updatedScore);
    }

    res.json(updatedScore);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteLiveScore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const score = await LiveScore.findById(req.params.id);
    if (!score) {
      res.status(404).json({ message: 'Score not found' });
      return;
    }
    await LiveScore.deleteOne({ _id: req.params.id });
    res.json({ message: 'Score removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
