import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  studentId: string;
  uniqueId: string;
  photo: string;
  department: string;
  year: number;
  phone: string;
  enrolledEvents: mongoose.Types.ObjectId[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'student'], default: 'student' },
    studentId: { type: String, trim: true },
    uniqueId: { type: String, trim: true, sparse: true },
    photo: { type: String, trim: true },
    department: { type: String, trim: true },
    year: { type: Number },
    phone: { type: String, trim: true },
    enrolledEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
