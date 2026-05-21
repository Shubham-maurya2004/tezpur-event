import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [preview, setPreview] = useState('');

  const links = [
    { to: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { to: '/admin/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { to: '/admin/events', label: 'All Events', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { to: '/admin/create-event', label: 'Create Event', icon: 'M12 4v16m8-8H4' },
    { to: '/admin/users', label: 'Manage Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { to: '/admin/pending', label: 'Pending Approval', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { to: '/admin/livescores', label: 'Live Scores', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around py-2 px-1">
        {links.slice(0, 5).map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex flex-col items-center p-1 rounded-lg ${
              location.pathname === link.to ? 'text-navy-700' : 'text-gray-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
            </svg>
            <span className="text-[10px] mt-0.5">{link.label.split(' ')[0]}</span>
          </Link>
        ))}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-navy-800 text-white">
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy-700">
          <span className="text-lg font-serif font-bold">Tezpur Events</span>
          {user?.photo ? (
            <img src={user.photo} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer" onClick={() => setPreview(user.photo!)} />
          ) : (
            <div className="w-8 h-8 rounded-full bg-navy-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-navy-700">
          <button onClick={handleLogout} className="sidebar-link w-full text-left">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {preview && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center" onClick={() => setPreview('')}>
          <img src={preview} alt="Profile" className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
