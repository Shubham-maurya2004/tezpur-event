import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Alert } from '../components/ui/alert';

const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const email = (location.state as any)?.email || '';
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authAPI.verifyOtp(email, otp);
      setMessage('OTP verified');
      setTimeout(() => navigate('/reset-password', { state: { email, otp } }), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No email provided. <Link to="/forgot-password" className="text-navy-700 font-medium hover:underline">Go back</Link></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy-800">Tezpur University</h1>
          <p className="text-gray-500 mt-2">Enter the OTP sent to {email}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-serif font-semibold text-navy-800 mb-6">Verify OTP</h2>
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}
          {message && <Alert variant="success" className="mb-4">{message}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="input-field" placeholder="Enter 6-digit OTP" maxLength={6} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/forgot-password" className="text-navy-700 font-medium hover:underline">Resend OTP</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
