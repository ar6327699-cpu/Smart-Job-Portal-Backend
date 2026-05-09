import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, MapPin, Calendar, Clock, Building, Check, Mail, Phone, User, Sparkles, BookOpen, DollarSign, Edit, Trash2 } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  // CRUD Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'Full-time',
    salary: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Logged-in user information
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const jobResponse = await api.get(`/api/jobs/jobs/${id}/`);
      setJob(jobResponse.data);

      if (user) {
        try {
          if (user.is_seeker) {
            const appResponse = await api.get('/api/jobs/applications/');
            const appData = appResponse.data.results ? appResponse.data.results : appResponse.data;
            const alreadyApplied = appData.some(app => app.job === parseInt(id));
            setApplied(alreadyApplied);
          }

          if (user.is_employer && jobResponse.data.employer === user.id) {
            const appResponse = await api.get('/api/jobs/applications/');
            const appData = appResponse.data.results ? appResponse.data.results : appResponse.data;
            const jobApplicants = appData.filter(app => app.job === parseInt(id));
            setApplicants(jobApplicants);
          }
        } catch (appErr) {
          console.error("Failed to load application statuses:", appErr);
        }
      }
    } catch (err) {
      setError('Failed to load job details. It might have been deleted or doesn\'t exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const response = await api.put(`/api/jobs/jobs/${id}/`, editFormData);
      setJob(response.data);
      setIsEditing(false);
    } catch (err) {
      setEditError('Failed to update job details. Please verify your credentials.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job listing? This action cannot be undone.")) {
      try {
        await api.delete(`/api/jobs/jobs/${id}/`);
        navigate('/jobs');
      } catch (err) {
        alert("Failed to delete job listing. You might not have permission.");
      }
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setApplyLoading(true);
      await api.post('/api/jobs/applications/', {
        job: parseInt(id),
        cover_letter: "I am applying for this position through the AI Job Portal."
      });
      setApplied(true);
      alert('Application submitted successfully! A confirmation email has been sent.');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit application.');
    } finally {
      setApplyLoading(false);
    }
  };

  const getJobTypeBadge = (type) => {
    if (!type) return 'badge-fulltime';
    const t = type.toLowerCase();
    if (t.includes('full')) return 'badge-fulltime';
    if (t.includes('part')) return 'badge-parttime';
    if (t.includes('remote')) return 'badge-remote';
    if (t.includes('intern')) return 'badge-internship';
    return 'badge-fulltime';
  };

  if (loading) {
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
        <p style={{ color: 'var(--text-secondary)' }}>Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-4" style={{ padding: '4rem 0' }}>
        <div className="error-message" style={{ maxWidth: '500px', margin: '0 auto' }}>{error}</div>
        <Link to="/jobs" className="btn-outline" style={{ marginTop: '2rem' }}>
          <ArrowLeft size={16} /> Back to Listings
        </Link>
      </div>
    );
  }

  if (!job) return <div className="container text-center mt-4" style={{ padding: '4rem 0' }}>Job not found.</div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2.5rem', paddingBottom: '4rem' }}>
      
      {/* Back button */}
      <Link to="/jobs" style={{ 
        color: 'var(--text-secondary)', 
        textDecoration: 'none', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        fontSize: '0.95rem',
        fontWeight: 600,
        marginBottom: '2rem',
        transition: 'color var(--transition-fast)'
      }}
      onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
      onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft size={16} />
        Back to Jobs List
      </Link>

      <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem' }}>
        {isEditing ? (
          <form onSubmit={handleUpdateJob} className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.75rem', fontWeight: 800 }}>
              Edit <span className="text-gradient">Job Listing</span>
            </h2>

            {editError && (
              <div className="error-message text-center mb-6" style={{ fontSize: '0.85rem' }}>
                {editError}
              </div>
            )}

            {/* Job Title */}
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input 
                type="text" 
                className="form-control"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                placeholder="Enter job title"
                required 
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <input 
                type="text" 
                className="form-control"
                value={editFormData.location}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                placeholder="Enter job location"
                required 
              />
            </div>

            {/* Job Type & Salary Range */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label className="form-label">Job Type</label>
                <select 
                  className="form-control"
                  value={editFormData.job_type}
                  onChange={(e) => setEditFormData({ ...editFormData, job_type: e.target.value })}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              
              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label className="form-label">Salary Range (Optional)</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={editFormData.salary}
                  onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                  placeholder="e.g. Rs 150,000 - Rs 220,000 / Mo"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Job Description & Candidate Requirements</label>
              <textarea 
                className="form-control" 
                rows="8"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Describe the job description..."
                required
              ></textarea>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '10px', fontSize: '0.95rem' }} disabled={editLoading}>
                {editLoading ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button type="button" className="btn-outline" style={{ padding: '0.8rem 2rem', borderRadius: '10px', fontSize: '0.95rem' }} onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Title Block */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          flexWrap: 'wrap', 
          gap: '1.5rem', 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '2rem', 
          marginBottom: '2rem' 
        }}>
          <div>
            <h1 style={{ marginBottom: '0.75rem', fontSize: '2.4rem', lineHeight: '1.2' }}>{job.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              <Building size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Company: <strong style={{ color: 'var(--text-primary)' }}>{job.employer_name}</strong></span>
            </div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span className={`badge ${getJobTypeBadge(job.job_type)}`} style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
              <Clock size={14} style={{ marginRight: '0.2rem' }} />
              {job.job_type}
            </span>
            <span style={{ 
              fontSize: '0.85rem', 
              color: 'var(--text-muted)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.3rem' 
            }}>
              <Calendar size={13} />
              Posted on {new Date(job.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2.5rem'
        }}>
          {/* Location card */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid var(--border-color)', 
            padding: '1.25rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ 
              background: 'rgba(20, 184, 166, 0.1)', 
              color: 'var(--accent-teal)', 
              padding: '0.6rem', 
              borderRadius: '10px' 
            }}>
              <MapPin size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Location</span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{job.location}</strong>
            </div>
          </div>

          {/* Salary card */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid var(--border-color)', 
            padding: '1.25rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ 
              background: 'rgba(245, 158, 11, 0.1)', 
              color: 'var(--warning)', 
              padding: '0.6rem', 
              borderRadius: '10px' 
            }}>
              <DollarSign size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Salary Range</span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--warning)' }}>{job.salary || 'Competitive / Neg.'}</strong>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', padding: '2rem', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem' }}>
            <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} />
            Description & Requirements
          </h3>
          <p style={{ 
            whiteSpace: 'pre-line', 
            lineHeight: '1.8', 
            color: 'var(--text-secondary)',
            fontSize: '1.025rem'
          }}>
            {job.description}
          </p>
        </div>

        {/* Action Button Section */}
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '3rem', paddingTop: '2rem', textAlign: 'center' }}>
          {user && user.is_employer ? (
            job.employer === user.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: 'var(--accent-primary)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  <Sparkles size={16} />
                  You posted this job listing. Candidate applications are displayed below.
                </div>
                
                {/* CRUD Options for Employer */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button 
                    onClick={() => {
                      setEditFormData({
                        title: job.title,
                        description: job.description,
                        location: job.location,
                        job_type: job.job_type,
                        salary: job.salary || ''
                      });
                      setIsEditing(true);
                      setEditError('');
                    }}
                    className="btn-outline"
                    style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Edit size={14} />
                    Edit Job Details
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="btn-outline"
                    style={{ 
                      padding: '0.65rem 1.5rem', 
                      borderRadius: '10px', 
                      fontSize: '0.9rem', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--danger)',
                      borderColor: 'rgba(244, 63, 94, 0.25)',
                      background: 'rgba(244, 63, 94, 0.02)'
                    }}
                  >
                    <Trash2 size={14} />
                    Delete Listing
                  </button>
                </div>
              </div>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
                Logged in as Employer (Applications are restricted to Job Seeker profiles)
              </span>
            )
          ) : applied ? (
            <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', cursor: 'default' }} disabled>
              <Check size={18} />
              Applied Successfully
            </button>
          ) : (
            <button className="btn-primary" style={{ minWidth: '220px', padding: '1rem 2.5rem', fontSize: '1.05rem', borderRadius: '12px' }} onClick={handleApply} disabled={applyLoading}>
              {applyLoading ? 'Submitting...' : 'Apply Now'}
            </button>
          )}
        </div>
          </>
        )}
      </div>

      {/* APPLICANTS BOARD (Employer Dashboard View) */}
      {user && user.is_employer && job.employer === user.id && (
        <div className="animate-fade-in" style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <User size={24} style={{ color: 'var(--accent-secondary)' }} />
            <h2 style={{ fontSize: '1.8rem' }}>
              Received Applications (<span className="text-gradient-purple" style={{fontWeight: 800}}>{applicants.length}</span>)
            </h2>
          </div>

          {applicants.length === 0 ? (
            <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: 'rgba(11, 15, 26, 0.3)' }}>
              <User size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Applicants Yet</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                No job seekers have applied to this post yet. Your listing is live and active.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {applicants.map(app => (
                <div key={app.id} className="glass-card" style={{ 
                  padding: '2rem', 
                  borderLeft: '4px solid var(--accent-primary)',
                  background: 'rgba(11, 15, 26, 0.55)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.35rem', marginBottom: '0.35rem', fontWeight: 700 }}>{app.seeker_name}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {/* Email Link */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                          <Mail size={14} style={{ color: 'var(--accent-primary)' }} />
                          <a href={`mailto:${app.seeker_email}`} style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                            {app.seeker_email}
                          </a>
                        </div>
                        {/* Phone Link (Dynamic) */}
                        {app.seeker_phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                            <Phone size={14} style={{ color: 'var(--accent-teal)' }} />
                            <a href={`tel:${app.seeker_phone}`} style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>
                              {app.seeker_phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-muted)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.3rem' 
                    }}>
                      <Calendar size={13} />
                      Applied: {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Skills tags */}
                  {app.seeker_skills && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Candidate Skills
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {app.seeker_skills.split(',').map((skill, index) => (
                          <span key={index} style={{ 
                            fontSize: '0.8rem', 
                            padding: '0.35rem 0.85rem', 
                            background: 'rgba(99, 102, 241, 0.08)', 
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            borderRadius: '8px',
                            fontWeight: 600,
                            color: '#a5b4fc'
                          }}>
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bio statement */}
                  {app.seeker_bio && (
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Candidate Statement
                      </span>
                      <div style={{ 
                        background: 'rgba(0, 0, 0, 0.25)', 
                        padding: '1rem 1.25rem', 
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.03)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        fontStyle: 'italic'
                      }}>
                        "{app.seeker_bio}"
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;
