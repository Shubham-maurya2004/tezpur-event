import React, { useEffect, useState } from 'react';
import { authAPI, eventAPI } from '../services/api';
import { User, Event } from '../types';
import AdminSidebar from '../components/AdminSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Tabs } from '../components/ui/tabs';
import { Alert } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

const PendingApproval: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    try {
      const [usersRes, eventsRes] = await Promise.all([authAPI.getUsers(), eventAPI.getAll()]);
      setPendingUsers(usersRes.data.filter((u: User) => u.approvalStatus === 'pending'));
      setPendingEvents(eventsRes.data.filter((e: Event) => e.status === 'pending'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApproveUser = async (id: string) => {
    try {
      await authAPI.updateApproval(id, 'approved');
      setMessage('User approved');
      fetchPending();
    } catch { setMessage('Failed to approve'); }
  };

  const handleRejectUser = async (id: string) => {
    try {
      await authAPI.updateApproval(id, 'rejected');
      setMessage('User rejected');
      fetchPending();
    } catch { setMessage('Failed to reject'); }
  };

  const handleApproveEvent = async (id: string) => {
    try {
      await eventAPI.approve(id);
      setMessage('Event approved');
      fetchPending();
    } catch { setMessage('Failed to approve'); }
  };

  const handleRejectEvent = async (id: string) => {
    try {
      await eventAPI.reject(id);
      setMessage('Event rejected');
      fetchPending();
    } catch { setMessage('Failed to reject'); }
  };

  const tabs = [
    {
      id: 'users',
      label: `Users (${pendingUsers.length})`,
      content: loading ? <p className="text-gray-500">Loading...</p> : pendingUsers.length === 0 ? (
        <p className="text-gray-500 py-4">No pending user approvals.</p>
      ) : (
        <div className="space-y-3">
          {pendingUsers.map((u) => (
            <div key={u._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-navy-700">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email} • {u.role} • {u.studentId || 'N/A'}</p>
                <p className="text-xs text-gray-400">{u.department} {u.year ? `• Year ${u.year}` : ''}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleApproveUser(u._id)} className="btn-success text-xs">Approve</button>
                <button onClick={() => handleRejectUser(u._id)} className="btn-danger text-xs">Reject</button>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'events',
      label: `Events (${pendingEvents.length})`,
      content: loading ? <p className="text-gray-500">Loading...</p> : pendingEvents.length === 0 ? (
        <p className="text-gray-500 py-4">No pending event approvals.</p>
      ) : (
        <div className="space-y-3">
          {pendingEvents.map((e) => (
            <div key={e._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-navy-700">{e.name}</p>
                <p className="text-sm text-gray-500">{e.category} • {e.eventType} • {e.venue}</p>
                <p className="text-xs text-gray-400">{new Date(e.startDate).toLocaleDateString()} - {new Date(e.endDate).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleApproveEvent(e._id)} className="btn-success text-xs">Approve</button>
                <button onClick={() => handleRejectEvent(e._id)} className="btn-danger text-xs">Reject</button>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-navy-800">Pending Approvals</h1>
          <p className="text-gray-500">Review and approve pending users and events</p>
        </div>
        {message && <Alert variant="info" className="mb-4">{message}</Alert>}
        <Card hover={false}>
          <CardContent>
            <Tabs tabs={tabs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingApproval;
