import React, { useEffect, useState } from 'react';
import { eventAPI } from '../services/api';
import { Event } from '../types';
import AdminSidebar from '../components/AdminSidebar';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog } from '../components/ui/dialog';
import { Alert } from '../components/ui/alert';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  upcoming: 'info',
  ongoing: 'success',
  completed: 'default',
  cancelled: 'danger',
  pending: 'warning',
};

const AllEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showEdit, setShowEdit] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await eventAPI.getAll();
      setEvents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventAPI.delete(id);
      setMessage('Event deleted');
      fetchEvents();
    } catch { setMessage('Delete failed'); }
  };

  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setEditForm({
      name: event.name,
      category: event.category,
      eventType: event.eventType,
      description: event.description,
      venue: event.venue,
      startDate: event.startDate?.split('T')[0],
      endDate: event.endDate?.split('T')[0],
      enrollmentDeadline: event.enrollmentDeadline?.slice(0, 16),
      maxParticipants: event.maxParticipants,
      status: event.status,
    });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!editEvent) return;
    try {
      await eventAPI.update(editEvent._id, editForm);
      setMessage('Event updated');
      setShowEdit(false);
      fetchEvents();
    } catch { setMessage('Update failed'); }
  };

  const handleViewStudents = async (eventId: string) => {
    try {
      const res = await eventAPI.getStudents(eventId);
      setStudents(res.data);
      setSelectedEvent(eventId);
      setShowStudents(true);
    } catch { setMessage('Failed to load students'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-navy-800">All Events</h1>
          <p className="text-gray-500">Manage all events</p>
        </div>
        {message && <Alert variant="info" className="mb-4">{message}</Alert>}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{event.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{event.category} • {event.eventType}</p>
                    </div>
                    <Badge variant={statusVariant[event.status] || 'default'}>{event.status}</Badge>
                  </div>
                </CardHeader>
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-gray-500 mb-4">
                    <div><span className="font-medium text-navy-700">Venue:</span> {event.venue}</div>
                    <div><span className="font-medium text-navy-700">Start:</span> {new Date(event.startDate).toLocaleDateString()}</div>
                    <div><span className="font-medium text-navy-700">End:</span> {new Date(event.endDate).toLocaleDateString()}</div>
                    <div><span className="font-medium text-navy-700">Enroll by:</span> {event.enrollmentDeadline ? new Date(event.enrollmentDeadline).toLocaleString() : 'No deadline'}</div>
                    <div><span className="font-medium text-navy-700">Participants:</span> {Array.isArray(event.participants) ? event.participants.length : 0}/{event.maxParticipants}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleEdit(event)} className="btn-primary text-xs">Edit</button>
                    <button onClick={() => handleDelete(event._id)} className="btn-danger text-xs">Delete</button>
                    <button onClick={() => handleViewStudents(event._id)} className="btn-outline text-xs">View Students</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showEdit} onClose={() => setShowEdit(false)} title="Edit Event">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Name</label><input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="input-field" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Category</label>
                <select value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="input-field">
                  <option value="sports">Sports</option>
                  <option value="techxetra">TechXetra</option>
                  <option value="cultural">Cultural</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})} className="input-field">
                  <option value="pending">Pending</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Event Type</label>
              <select value={editForm.eventType} onChange={(e) => setEditForm({...editForm, eventType: e.target.value})} className="input-field">
                <option value="Solo">Solo</option>
                <option value="Team">Team</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Venue</label><input value={editForm.venue} onChange={(e) => setEditForm({...editForm, venue: e.target.value})} className="input-field" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-navy-700 mb-1">Start Date</label><input type="date" value={editForm.startDate} onChange={(e) => setEditForm({...editForm, startDate: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-navy-700 mb-1">End Date</label><input type="date" value={editForm.endDate} onChange={(e) => setEditForm({...editForm, endDate: e.target.value})} className="input-field" /></div>
            </div>
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Enrollment Deadline</label><input type="datetime-local" value={editForm.enrollmentDeadline} onChange={(e) => setEditForm({...editForm, enrollmentDeadline: e.target.value})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Max Participants</label><input type="number" value={editForm.maxParticipants} onChange={(e) => setEditForm({...editForm, maxParticipants: Number(e.target.value)})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-navy-700 mb-1">Description</label><textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="input-field" rows={3} /></div>
            <button onClick={handleUpdate} className="btn-primary w-full">Update Event</button>
          </div>
        </Dialog>

        <Dialog open={showStudents} onClose={() => setShowStudents(false)} title="Enrolled Students">
          {students.length === 0 ? (
            <p className="text-gray-500">No students enrolled.</p>
          ) : (
            <div className="space-y-3">
              {students.map((s: any) => (
                <div key={s._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-navy-700">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.email} • {s.studentId || 'N/A'}</p>
                  </div>
                  <span className="text-xs text-gray-500">{s.department || ''} {s.year || ''}</span>
                </div>
              ))}
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default AllEvents;
