import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Briefcase, MapPin, Clock, DollarSign, FileText, Sparkles, PlusCircle } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'Full-time',
    salary: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/jobs/jobs/', formData);
      navigate('/jobs');
    } catch (err) {
      setError('Failed to post job. Please ensure you are logged in as an Employer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem', paddingBottom: '4rem' }}>
      <div className="glass-card" style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem' }}>
        
        {/* Post Job Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '0.75rem',
              borderRadius: '12px',
              color: 'var(--warning)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
            }}>
              <PlusCircle size={26} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Post a <span className="text-gradient">New Job</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
            Find your perfect candidate automatically using our smart AI matchmaking portal.
          </p>
        </div>

        {error && <div className="error-message text-center mb-6">{error}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Job Title */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Briefcase size={14} style={{ color: 'var(--accent-primary)' }} />
              Job Title
            </label>
            <input 
              type="text" 
              name="title"
              className="form-control" 
              placeholder="e.g. Senior Full Stack Engineer (React & Django)"
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} style={{ color: 'var(--accent-teal)' }} />
              Location
            </label>
            <input 
              type="text" 
              name="location"
              className="form-control" 
              placeholder="e.g. Remote, Lahore, Karachi, Pakistan"
              value={formData.location}
              onChange={handleChange}
              required 
            />
          </div>

          {/* Job Type & Salary Fields */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} style={{ color: 'var(--accent-secondary)' }} />
                Job Type
              </label>
              <select 
                name="job_type" 
                className="form-control"
                value={formData.job_type}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <DollarSign size={14} style={{ color: 'var(--warning)' }} />
                Salary Range (Optional)
              </label>
              <input 
                type="text" 
                name="salary"
                className="form-control" 
                placeholder="e.g. Rs 150,000 - Rs 200,000 / Mo"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Job Description & Requirements */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} style={{ color: 'var(--accent-primary)' }} />
              Job Description & Candidate Requirements
            </label>
            <textarea 
              name="description"
              className="form-control" 
              rows="7"
              placeholder="Describe the job scope, responsibilities, and key technologies required (e.g. Python, React, SQL). Our AI model matches candidates directly based on these requirements."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* AI Info Card */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            padding: '1.25rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'start',
            gap: '0.75rem'
          }}>
            <Sparkles size={18} style={{ color: 'var(--accent-secondary)', marginTop: '0.1rem', flexShrink: 0 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', margin: 0, lineHeight: '1.5' }}>
              <strong>AI Matchmaking Enabled:</strong> Once posted, our system will parse the core tech keywords in your requirements description. It will automatically present matching seeker CVs and trigger instant email applications for candidates with Auto-Apply enabled.
            </p>
          </div>

          <button type="submit" className="btn-primary w-100" style={{ padding: '0.95rem', borderRadius: '12px', fontSize: '1.05rem' }} disabled={loading}>
            {loading ? 'Posting Listing...' : 'Publish Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
