import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import { Event } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs } from '../components/ui/tabs';
import { Alert } from '../components/ui/alert';
import TopNav from '../components/TopNav';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  upcoming: 'info',
  ongoing: 'success',
  completed: 'default',
  cancelled: 'danger',
  pending: 'warning',
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await eventAPI.getAll();
      setEvents(res.data);
      if (user) {
        const enrolled = res.data.filter((e) =>
          e.participants.some((p: any) => (typeof p === 'string' ? p : p._id) === user._id)
        );
        setMyEvents(enrolled);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (eventId: string) => {
    try {
      await eventAPI.enroll(eventId);
      setMessage('Enrolled successfully!');
      fetchEvents();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleUnenroll = async (eventId: string) => {
    try {
      await eventAPI.unenroll(eventId);
      setMessage('Unenrolled successfully!');
      fetchEvents();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Unenrollment failed');
    }
  };

  const renderEventCard = (event: Event, showEnroll = true) => {
    const isEnrolled = user && event.participants.some((p: any) => (typeof p === 'string' ? p : p._id) === user._id);
    return (
      <Card key={event._id} className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{event.name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{event.category} • {event.eventType}</p>
            </div>
            <Badge variant={statusVariant[event.status] || 'default'}>{event.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm mb-3">{event.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-gray-500 mb-4">
            <div><span className="font-medium text-navy-700">Venue:</span> {event.venue}</div>
            <div><span className="font-medium text-navy-700">Start:</span> {new Date(event.startDate).toLocaleDateString()}</div>
            <div><span className="font-medium text-navy-700">End:</span> {new Date(event.endDate).toLocaleDateString()}</div>
            <div><span className="font-medium text-navy-700">Enroll by:</span> {event.enrollmentDeadline ? new Date(event.enrollmentDeadline).toLocaleString() : 'No deadline'}</div>
            <div><span className="font-medium text-navy-700">Participants:</span> {Array.isArray(event.participants) ? event.participants.length : 0}/{event.maxParticipants}</div>
          </div>
          {showEnroll && user?.role === 'student' && (
            <div className="flex gap-2">
              {!isEnrolled ? (
                <button onClick={() => handleEnroll(event._id)} className="btn-gold text-xs">Enroll Now</button>
              ) : (
                <button onClick={() => handleUnenroll(event._id)} className="btn-outline text-xs">Unenroll</button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    {
      id: 'all',
      label: 'All Events',
      content: loading ? <p className="text-gray-500">Loading...</p> : (
        events.length === 0 ? <p className="text-gray-500">No events available.</p> : events.map((e) => renderEventCard(e))
      ),
    },
    {
      id: 'my',
      label: 'My Events',
      content: loading ? <p className="text-gray-500">Loading...</p> : (
        myEvents.length === 0 ? <p className="text-gray-500">You haven't enrolled in any events yet.</p> : myEvents.map((e) => renderEventCard(e))
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-navy-800">Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name}</p>
        </div>
        {message && <Alert variant="info" className="mb-4">{message}</Alert>}
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default Dashboard;
