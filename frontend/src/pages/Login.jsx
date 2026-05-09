import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { LogIn, User, Lock, Sparkles, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/accounts/api/login/', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/'); // Redirect to home page
      window.location.reload(); // Refresh state so Navbar updates
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-container animate-fade-in" style={{ position: 'relative' }}>
      {/* Decorative background glow spots */}
      <div className="glow-ambient" style={{ top: '-10%', left: '-10%', width: '250px', height: '250px', background: 'rgba(99, 102, 241, 0.12)' }} />
      <div className="glow-ambient" style={{ bottom: '-15%', right: '-10%', width: '250px', height: '250px', background: 'rgba(168, 85, 247, 0.1)' }} />

      <div className="glass-card" style={{ padding: '3rem', position: 'relative', zIndex: 1 }}>
        
        {/* Decorative Sparkle Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '0.75rem',
            borderRadius: '12px',
            color: 'var(--accent-primary)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
          }}>
            <LogIn size={26} />
          </div>
        </div>

        <h2 className="text-center mb-2" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          Welcome <span className="text-gradient">Back</span>
        </h2>
        <p className="text-center text-secondary mb-6" style={{ fontSize: '0.925rem' }}>
          Log in to manage your career or active listings.
        </p>
        
        {error && (
          <div className="error-message text-center mb-6" style={{ fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} style={{ position: 'absolute', left: '1rem', color: 'rgba(255, 255, 255, 0.35)' }} />
              <input 
                type="text" 
                name="username"
                className="form-control" 
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', color: 'rgba(255, 255, 255, 0.35)' }} />
              <input 
                type="password" 
                name="password"
                className="form-control" 
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary w-100 mt-4" style={{ padding: '0.9rem', borderRadius: '12px', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center mt-4 text-secondary" style={{ fontSize: '0.9rem', marginTop: '1.75rem' }}>
          Don't have an account? <Link to="/register" className="text-gradient" style={{fontWeight: 700}}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
