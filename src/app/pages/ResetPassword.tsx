import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Alert } from '../components/ui/alert';

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const state = location.state as any;
  const email = state?.email || '';
  const otp = state?.otp || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(email, otp, password);
      setMessage('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !otp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid request. <Link to="/forgot-password" className="text-navy-700 font-medium hover:underline">Start over</Link></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy-800">Tezpur University</h1>
          <p className="text-gray-500 mt-2">Create a new password</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-serif font-semibold text-navy-800 mb-6">Reset Password</h2>
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}
          {message && <Alert variant="success" className="mb-4">{message}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-navy-700 font-medium hover:underline">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
