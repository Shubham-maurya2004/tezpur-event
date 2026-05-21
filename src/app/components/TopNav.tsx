import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const navLinks = isAdmin
    ? [
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/profile', label: 'Profile' },
        { to: '/admin/events', label: 'All Events' },
        { to: '/admin/create-event', label: 'Create Event' },
        { to: '/admin/users', label: 'Manage Users' },
        { to: '/admin/pending', label: 'Pending Approval' },
        { to: '/admin/livescores', label: 'Live Scores' },
      ]
    : [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/profile', label: 'Profile' },
        { to: '/livescores', label: 'Live Scores' },
      ];

  return (
    <>
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-navy-800">Tezpur Events</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-navy-700 text-white'
                    : 'text-navy-600 hover:bg-navy-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
              {user?.photo ? (
                <img src={user.photo} alt="" className="w-7 h-7 rounded-full object-cover cursor-pointer" onClick={() => setPreview(user.photo!)} />
              ) : (
                <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center text-navy-500 text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="text-sm text-gray-500">{user?.name}</span>
              <button onClick={handleLogout} className="btn-outline text-xs !py-1.5 !px-3">Logout</button>
            </div>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6 text-navy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.to ? 'bg-navy-700 text-white' : 'text-navy-600 hover:bg-navy-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <button onClick={handleLogout} className="btn-outline text-xs w-full !py-1.5">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
      {preview && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center" onClick={() => setPreview('')}>
          <img src={preview} alt="Profile" className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
};

export default TopNav;
