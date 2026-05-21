import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/ui/alert';

const Register: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student', studentId: '', department: '', year: '', phone: '', uniqueId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const isAdmin = form.role === 'admin';
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        studentId: isAdmin ? undefined : form.studentId,
        department: form.department,
        year: isAdmin ? undefined : (form.year ? Number(form.year) : undefined),
        phone: form.phone,
        uniqueId: isAdmin ? form.uniqueId : undefined,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy-800">Tezpur University</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-serif font-semibold text-navy-800 mb-6">Register</h2>
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm Password</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="input-field">
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {form.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Student ID</label>
                  <input type="text" name="studentId" value={form.studentId} onChange={handleChange} className="input-field" />
                </div>
              )}
              {form.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Unique ID</label>
                  <input type="text" name="uniqueId" value={form.uniqueId} onChange={handleChange} className="input-field" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Department</label>
                <input type="text" name="department" value={form.department} onChange={handleChange} className="input-field" />
              </div>
              {form.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Year</label>
                  <input type="number" name="year" value={form.year} onChange={handleChange} className="input-field" />
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-navy-700 font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
