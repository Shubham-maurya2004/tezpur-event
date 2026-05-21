import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Alert } from '../components/ui/alert';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    category: 'sports',
    eventType: '',
    description: '',
    venue: '',
    startDate: '',
    endDate: '',
    enrollmentDeadline: '',
    maxParticipants: 50,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'maxParticipants' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await eventAPI.create(form);
      setMessage('Event created successfully!');
      setForm({ name: '', category: 'sports', eventType: '', description: '', venue: '', startDate: '', endDate: '', enrollmentDeadline: '', maxParticipants: 50 });
      setTimeout(() => navigate('/admin/events'), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-navy-800">Create Event</h1>
          <p className="text-gray-500">Add a new event to the platform</p>
        </div>
        <Card hover={false} className="max-w-2xl">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          {message && (
            <Alert variant={message.includes('success') ? 'success' : 'error'} className="mx-6 mb-4">
              {message}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Event Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  <option value="sports">Sports</option>
                  <option value="techxetra">TechXetra</option>
                  <option value="cultural">Cultural</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Event Type</label>
                <select name="eventType" value={form.eventType} onChange={handleChange} className="input-field" required>
                  <option value="">Select type</option>
                  <option value="Solo">Solo</option>
                  <option value="Team">Team</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Venue</label>
              <input type="text" name="venue" value={form.venue} onChange={handleChange} className="input-field" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Start Date & Time</label>
                <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">End Date & Time</label>
                <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Enrollment Deadline</label>
              <input type="datetime-local" name="enrollmentDeadline" value={form.enrollmentDeadline} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Max Participants</label>
              <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className="input-field" min={1} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={4} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvent;
