import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadPhoto } from '../services/api';
import TopNav from '../components/TopNav';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Alert } from '../components/ui/alert';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    department: user?.department || '',
    year: user?.year || '',
    phone: user?.phone || '',
    photo: user?.photo || '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadPhoto(file);
      setForm((prev) => ({ ...prev, photo: res.data.photo }));
    } catch {
      setMessage('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await updateUser({
        ...form,
        year: form.year ? Number(form.year) : undefined,
      });
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-navy-800">My Profile</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          {message && <Alert variant="success" className="mx-6 mb-4">{message}</Alert>}
          <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
            <div className="flex justify-center mb-4">
              {form.photo ? (
                <img src={form.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-navy-200" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-navy-100 flex items-center justify-center text-navy-500 text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Student ID</label>
                <input type="text" name="studentId" value={form.studentId} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Department</label>
                <input type="text" name="department" value={form.department} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Year</label>
                <input type="number" name="year" value={form.year} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Profile Photo</label>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="input-field" disabled={uploading} />
                {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
