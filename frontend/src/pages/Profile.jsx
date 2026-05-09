import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { User, Code, Sparkles, FileText, Save, LogOut, Check, ChevronRight } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    auto_apply_enabled: false,
    role: 'seeker' // Added for role switching
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/accounts/api/profile/');
        setUser(response.data);
        setFormData({
          bio: response.data.bio || '',
          skills: response.data.skills || '',
          auto_apply_enabled: response.data.auto_apply_enabled || false,
          role: response.data.is_employer ? 'employer' : 'seeker'
        });
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const is_employer = formData.role === 'employer';
      const is_seeker = formData.role === 'seeker';

      const payload = {
        ...formData,
        is_employer,
        is_seeker
      };

      const response = await api.put('/accounts/api/profile/', payload);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage('success:Profile updated successfully!');
      
      if (user.is_employer !== is_employer) {
        window.location.reload();
      }

    } catch (error) {
      setMessage('error:Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Reload to refresh navbar state
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid rgba(99, 102, 241, 0.1)', 
          borderTopColor: 'var(--accent-primary)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading profile settings...</p>
      </div>
    );
  }

  const isSuccess = message.startsWith('success:');
  const displayMessage = message ? message.split(':')[1] : '';

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem', paddingBottom: '4rem' }}>
      <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto', padding: '3rem' }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* User Avatar Circle */}
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.1rem' }}>
                My <span className="text-gradient">Profile</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Signed in as: <strong>{user.username}</strong>
              </p>
            </div>
          </div>
          
          <button 
            className="btn-outline" 
            onClick={handleLogout} 
            style={{ 
              color: 'var(--danger)', 
              borderColor: 'rgba(244, 63, 94, 0.25)',
              background: 'rgba(244, 63, 94, 0.02)',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              borderRadius: '10px'
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div style={{ 
            marginBottom: '1.5rem', 
            padding: '0.9rem 1.25rem', 
            borderRadius: '12px', 
            background: isSuccess ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)', 
            border: isSuccess ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)',
            color: isSuccess ? 'var(--success)' : 'var(--danger)',
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={16} />
            {displayMessage}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          {/* Account Role Dropdown */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} style={{ color: 'var(--accent-primary)' }} />
              Account Type
            </label>
            <select 
              name="role" 
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            >
              <option value="seeker">Job Seeker (Applying for Jobs)</option>
              <option value="employer">Employer (Posting & Hiring)</option>
            </select>
          </div>

          {/* Bio Description Area */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} style={{ color: 'var(--accent-secondary)' }} />
              Profile Bio
            </label>
            <textarea 
              name="bio"
              className="form-control" 
              rows="4"
              placeholder="Describe your career goals, experience, and what makes you unique..."
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Conditional Job Seeker fields */}
          {formData.role === 'seeker' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              
              {/* Skills inputs */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Code size={14} style={{ color: 'var(--accent-teal)' }} />
                  Technical Skills (Comma separated)
                </label>
                <input 
                  type="text" 
                  name="skills"
                  className="form-control" 
                  placeholder="e.g. Python, Django, React, AWS, TypeScript"
                  value={formData.skills}
                  onChange={handleChange}
                />
                <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                  Enter skills separated by commas. Our AI matchmaking algorithm will use these to evaluate matching indexes.
                </small>
              </div>

              {/* Custom styled Toggle Box for AI Auto-Apply */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1rem', 
                padding: '1.5rem', 
                background: 'rgba(99, 102, 241, 0.05)', 
                borderRadius: '16px', 
                border: '1px solid rgba(99, 102, 241, 0.2)',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.03)'
              }}>
                <div style={{ marginTop: '0.2rem' }}>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      name="auto_apply_enabled"
                      checked={formData.auto_apply_enabled}
                      onChange={handleChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div>
                  <label style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      <Sparkles size={14} style={{ color: 'var(--accent-secondary)' }} />
                      Enable AI Auto-Apply
                    </strong>
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'block', lineHeight: '1.5' }}>
                      Automatically submit candidate applications to newly posted positions that share a 50% or higher match score with your listed skills.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-100 mt-6" style={{ padding: '0.9rem', borderRadius: '12px', fontSize: '1rem' }} disabled={loading}>
            <Save size={18} />
            {loading ? 'Saving Settings...' : 'Save Profile Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
