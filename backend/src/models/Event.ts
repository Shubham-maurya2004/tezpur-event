import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  category: 'sports' | 'techxetra' | 'cultural';
  eventType: string;
  description: string;
  venue: string;
  startDate: Date;
  endDate: Date;
  enrollmentDeadline: Date;
  maxParticipants: number;
  participants: mongoose.Types.ObjectId[];
  status: 'pending' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['sports', 'techxetra', 'cultural'], required: true },
    eventType: { type: String, required: true },
    description: { type: String, required: true },
    venue: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    enrollmentDeadline: { type: Date },
    maxParticipants: { type: Number, default: 50 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['pending', 'upcoming', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', eventSchema);
