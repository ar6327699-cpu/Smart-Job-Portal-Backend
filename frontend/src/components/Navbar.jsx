import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, LogOut, PlusCircle, LogIn, UserPlus, Sparkles } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error("Failed to parse user from local storage");
    localStorage.removeItem('user');
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Reload to refresh application state
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.5rem', fontWeight: 800 }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <Briefcase size={20} color="white" />
          </div>
          <span style={{ letterSpacing: '-0.5px' }}>
            AI<span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>Job</span><span className="text-gradient" style={{ fontWeight: 800 }}>Portal</span>
          </span>
        </Link>
        
        <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link 
            to="/jobs" 
            className={`nav-item ${isActive('/jobs') ? 'active' : ''}`}
            style={{
              position: 'relative',
              padding: '0.5rem 0.25rem',
              color: isActive('/jobs') ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive('/jobs') ? 600 : 500,
              transition: 'color 0.2s ease'
            }}
          >
            Find Jobs
            {isActive('/jobs') && (
              <span style={{
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                borderRadius: '99px',
                boxShadow: '0 1px 6px rgba(99, 102, 241, 0.6)'
              }} />
            )}
          </Link>
          
          {user && user.is_employer && (
            <Link 
              to="/post-job" 
              className={`nav-item ${isActive('/post-job') ? 'active' : ''}`}
              style={{
                position: 'relative',
                padding: '0.5rem 0.25rem',
                color: isActive('/post-job') ? 'var(--warning)' : 'rgba(245, 158, 11, 0.8)',
                fontWeight: isActive('/post-job') ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color 0.2s ease'
              }}
            >
              <PlusCircle size={16} />
              Post a Job
              {isActive('/post-job') && (
                <span style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--warning)',
                  borderRadius: '99px',
                  boxShadow: '0 1px 6px rgba(245, 158, 11, 0.6)'
                }} />
              )}
            </Link>
          )}
        </div>
        
        <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {user.is_seeker && user.auto_apply_enabled && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  color: 'var(--accent-teal)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '99px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  <Sparkles size={12} style={{ animation: 'spin 3s linear infinite' }} />
                  AI Auto-Apply On
                </div>
              )}
              
              <Link 
                to="/profile" 
                className="btn-outline" 
                style={{ 
                  padding: '0.55rem 1.1rem', 
                  borderRadius: '10px', 
                  fontSize: '0.9rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  background: isActive('/profile') ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                  borderColor: isActive('/profile') ? 'var(--accent-primary)' : 'var(--border-color)'
                }}
              >
                <div style={{ 
                  width: '22px', 
                  height: '22px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 500 }}>{user.username}</span>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="btn-outline" 
                style={{ 
                  padding: '0.55rem 0.85rem', 
                  borderRadius: '10px', 
                  fontSize: '0.9rem', 
                  color: 'var(--text-secondary)',
                  border: '1px solid transparent',
                  background: 'transparent'
                }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="btn-outline" 
                style={{ 
                  padding: '0.55rem 1.25rem', 
                  borderRadius: '10px', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <LogIn size={15} />
                Log in
              </Link>
              <Link 
                to="/register" 
                className="btn-primary" 
                style={{ 
                  padding: '0.55rem 1.25rem', 
                  borderRadius: '10px', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <UserPlus size={15} />
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
