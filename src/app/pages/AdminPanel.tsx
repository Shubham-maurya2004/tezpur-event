import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI, authAPI } from '../services/api';
import { Event, User } from '../types';
import AdminSidebar from '../components/AdminSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalUsers: 0, pendingApprovals: 0, upcomingEvents: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, usersRes] = await Promise.all([eventAPI.getAll(), authAPI.getUsers()]);
      const evts = eventsRes.data;
      const usrs = usersRes.data;
      setEvents(evts);
      setUsers(usrs);
      setStats({
        totalEvents: evts.length,
        totalUsers: usrs.length,
        pendingApprovals: usrs.filter((u) => u.approvalStatus === 'pending').length,
        upcomingEvents: evts.filter((e) => e.status === 'upcoming' || e.status === 'pending').length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-serif font-bold text-navy-800">Admin Dashboard</h1>
            <p className="text-gray-500">Welcome, {user?.name}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card hover>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-navy-700">{stats.totalEvents}</p>
                <p className="text-sm text-gray-500 mt-1">Total Events</p>
              </CardContent>
            </Card>
            <Card hover>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-navy-700">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500 mt-1">Total Users</p>
              </CardContent>
            </Card>
            <Card hover>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-gold-500">{stats.pendingApprovals}</p>
                <p className="text-sm text-gray-500 mt-1">Pending Approvals</p>
              </CardContent>
            </Card>
            <Card hover>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.upcomingEvents}</p>
                <p className="text-sm text-gray-500 mt-1">Upcoming Events</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                {events.slice(0, 5).map((evt) => (
                  <div key={evt._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-navy-700">{evt.name}</p>
                      <p className="text-xs text-gray-500">{evt.category} • {evt.status}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      evt.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      evt.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                      evt.status === 'completed' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                    }`}>{evt.status}</span>
                  </div>
                ))}
                {events.length === 0 && <p className="text-sm text-gray-500">No events created yet.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button onClick={() => navigate('/admin/create-event')} className="btn-primary w-full">Create New Event</button>
                <button onClick={() => navigate('/admin/events')} className="btn-outline w-full">Manage Events</button>
                <button onClick={() => navigate('/admin/users')} className="btn-outline w-full">Manage Users</button>
                <button onClick={() => navigate('/admin/pending')} className="btn-gold w-full">Pending Approvals</button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
