import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'seeker' // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = `/accounts/api/register/${formData.role}/`;
      
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await api.post(endpoint, payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
      window.location.reload(); // Refresh navbar and profile layouts
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData && typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        setError(`${firstKey}: ${errorData[firstKey][0]}`);
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-container animate-fade-in" style={{ position: 'relative' }}>
      {/* Decorative background glow spots */}
      <div className="glow-ambient" style={{ top: '-10%', right: '-10%', width: '250px', height: '250px', background: 'rgba(168, 85, 247, 0.12)' }} />
      <div className="glow-ambient" style={{ bottom: '-15%', left: '-10%', width: '250px', height: '250px', background: 'rgba(99, 102, 241, 0.1)' }} />

      <div className="glass-card" style={{ padding: '3rem', position: 'relative', zIndex: 1 }}>
        
        {/* Decorative Sparkle Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            padding: '0.75rem',
            borderRadius: '12px',
            color: 'var(--accent-secondary)',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)'
          }}>
            <UserPlus size={26} />
          </div>
        </div>

        <h2 className="text-center mb-2" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          Create <span className="text-gradient">Account</span>
        </h2>
        <p className="text-center text-secondary mb-6" style={{ fontSize: '0.925rem' }}>
          Join the smart, AI-powered tech matchmaking portal.
        </p>
        
        {error && (
          <div className="error-message text-center mb-6" style={{ fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Custom Role Selector (Sleek cards instead of HTML radio buttons) */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.75rem' }}>
              Choose Your Account Type
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div 
                onClick={() => handleRoleSelect('seeker')}
                style={{
                  flex: 1,
                  background: formData.role === 'seeker' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                  border: formData.role === 'seeker' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-color)',
                  boxShadow: formData.role === 'seeker' ? '0 0 15px rgba(99, 102, 241, 0.15)' : 'none',
                  padding: '1rem 0.5rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  color: formData.role === 'seeker' ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                Job Seeker
              </div>
              <div 
                onClick={() => handleRoleSelect('employer')}
                style={{
                  flex: 1,
                  background: formData.role === 'employer' ? 'rgba(168, 85, 247, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                  border: formData.role === 'employer' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid var(--border-color)',
                  boxShadow: formData.role === 'employer' ? '0 0 15px rgba(168, 85, 247, 0.15)' : 'none',
                  padding: '1rem 0.5rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  color: formData.role === 'employer' ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                Employer
              </div>
            </div>
          </div>

          {/* Username Input */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} style={{ position: 'absolute', left: '1rem', color: 'rgba(255, 255, 255, 0.35)' }} />
              <input 
                type="text" 
                name="username"
                className="form-control" 
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', color: 'rgba(255, 255, 255, 0.35)' }} />
              <input 
                type="email" 
                name="email"
                className="form-control" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', color: 'rgba(255, 255, 255, 0.35)' }} />
              <input 
                type="password" 
                name="password"
                className="form-control" 
                placeholder="Create secure password"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary w-100 mt-4" style={{ padding: '0.9rem', borderRadius: '12px', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 text-secondary" style={{ fontSize: '0.9rem', marginTop: '1.75rem' }}>
          Already have an account? <Link to="/login" className="text-gradient" style={{fontWeight: 700}}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
