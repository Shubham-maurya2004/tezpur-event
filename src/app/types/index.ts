export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  studentId: string;
  uniqueId?: string;
  photo?: string;
  department: string;
  year: number;
  phone: string;
  enrolledEvents: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  name: string;
  category: 'sports' | 'techxetra' | 'cultural';
  eventType: 'Solo' | 'Team' | 'Online' | 'Offline';
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  enrollmentDeadline?: string;
  maxParticipants: number;
  participants: string[] | User[];
  status: 'pending' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveScore {
  _id: string;
  eventId: string;
  eventName: string;
  matchTitle: string;
  team1: { name: string; score: number; players: string[] };
  team2: { name: string; score: number; players: string[] };
  individualScores: IndividualScore[];
  currentStatus: string;
  lastUpdated: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndividualScore {
  studentId: string;
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

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  studentId: string;
  department: string;
  year: number;
  phone: string;
  approvalStatus: string;
  enrolledEvents: string[];
  token: string;
}
