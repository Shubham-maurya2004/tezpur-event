import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { User } from '../types';
import AdminSidebar from '../components/AdminSidebar';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Alert } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await authAPI.getUsers();
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await authAPI.deleteUser(id);
      setMessage('User deleted');
      fetchUsers();
    } catch { setMessage('Delete failed'); }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.studentId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-navy-800">Manage Users</h1>
          <p className="text-gray-500">View and manage all registered users</p>
        </div>
        {message && <Alert variant="info" className="mb-4">{message}</Alert>}
        <Card hover={false}>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>All Users ({filtered.length})</CardTitle>
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field max-w-xs"
              />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No users found.</td></tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium text-navy-700 text-sm">{u.name}</span>
                          {u.photo ? (
                            <img src={u.photo} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer" onClick={() => setPreview(u.photo!)} />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-500 text-xs font-bold">
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === 'admin' ? 'info' : 'default'}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.studentId || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{u.department || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{u.year || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{u.phone || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.approvalStatus === 'approved' ? 'success' : u.approvalStatus === 'pending' ? 'warning' : 'danger'}>
                          {u.approvalStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(u._id)} className="btn-danger text-xs !px-2 !py-1">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {preview && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center" onClick={() => setPreview('')}>
          <img src={preview} alt="Profile" className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
