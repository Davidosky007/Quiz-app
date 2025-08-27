import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate('/questions')}
            >
              Quiz App
            </h1>
          </div>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/questions"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${
                  isActive
                    ? 'text-violet-700 border-violet-600'
                    : 'text-slate-700 hover:text-slate-900 border-transparent'
                }`
              }
            >
              Questions
            </NavLink>
            <NavLink
              to="/quiz"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${
                  isActive
                    ? 'text-violet-700 border-violet-600'
                    : 'text-slate-700 hover:text-slate-900 border-transparent'
                }`
              }
            >
              Take Quiz
            </NavLink>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User size={16} />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              title="Open menu"
            >
              <span className="sr-only">Open main menu</span>
              {/* Simple hamburger */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div id="mobile-menu" className={`md:hidden ${mobileOpen ? 'block' : 'hidden'} border-t border-gray-200 bg-white`}> 
        <div className="px-4 pt-2 pb-3 space-y-1">
          <NavLink
            to="/questions"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            Questions
          </NavLink>
          <NavLink
            to="/quiz"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            Take Quiz
          </NavLink>
          <button
            onClick={() => { setMobileOpen(false); handleLogout(); }}
            className="mt-2 w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;