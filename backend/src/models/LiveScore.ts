import mongoose, { Document, Schema } from 'mongoose';

export interface IIndividualScore {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  score: number;
  time: string;
  distance: string;
  position: number;
  kills: number;
  rank: number;
  points: number;
  additionalInfo: string;
}

export interface ILiveScore extends Document {
  eventId: mongoose.Types.ObjectId;
  eventName: string;
  matchTitle: string;
  team1: { name: string; score: number; players: mongoose.Types.ObjectId[] };
  team2: { name: string; score: number; players: mongoose.Types.ObjectId[] };
  individualScores: IIndividualScore[];
  currentStatus: string;
  lastUpdated: Date;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const liveScoreSchema = new Schema<ILiveScore>(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    eventName: { type: String, required: true },
    matchTitle: { type: String, required: true },
    team1: {
      name: { type: String, default: '' },
      score: { type: Number, default: 0 },
      players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    team2: {
      name: { type: String, default: '' },
      score: { type: Number, default: 0 },
      players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    individualScores: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        studentName: String,
        score: Number,
        time: String,
        distance: String,
        position: Number,
        kills: Number,
        rank: Number,
        points: Number,
        additionalInfo: String,
      },
    ],
    currentStatus: { type: String, default: 'ongoing' },
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<ILiveScore>('LiveScore', liveScoreSchema);
