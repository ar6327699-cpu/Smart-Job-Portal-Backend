import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, MapPin, Clock, Building, Briefcase, Eye, Calendar, ArrowRight, CheckSquare } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search state
  const [search, setSearch] = useState('');

  // Filter state for employers
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (searchQuery = '') => {
    try {
      setLoading(true);
      const url = searchQuery ? `/api/jobs/jobs/?search=${searchQuery}` : '/api/jobs/jobs/';
      const response = await api.get(url);
      setJobs(response.data.results ? response.data.results : response.data);
    } catch (err) {
      setError('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(search);
  };

  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  // Filter jobs based on employer if toggle is on
  const displayedJobs = showOnlyMine && user && user.is_employer
    ? jobs.filter(job => job.employer === user.id)
    : jobs;

  const getJobTypeBadge = (type) => {
    if (!type) return 'badge-fulltime';
    const t = type.toLowerCase();
    if (t.includes('full')) return 'badge-fulltime';
    if (t.includes('part')) return 'badge-parttime';
    if (t.includes('remote')) return 'badge-remote';
    if (t.includes('intern')) return 'badge-internship';
    return 'badge-fulltime';
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem', paddingBottom: '4rem' }}>
      {/* Search Header Container */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem', background: 'rgba(11, 15, 26, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
              Explore <span className="text-gradient">Latest Jobs</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Discover curated tech opportunities matching your talent profile.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {user && user.is_employer && (
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem', 
                background: showOnlyMine ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)', 
                padding: '0.75rem 1.25rem', 
                borderRadius: '12px', 
                border: showOnlyMine ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-color)', 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none'
              }}>
                <input 
                  type="checkbox" 
                  checked={showOnlyMine} 
                  onChange={(e) => setShowOnlyMine(e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: 'var(--warning)', width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: showOnlyMine ? 'var(--warning)' : 'var(--text-primary)' }}>My Posted Jobs</span>
              </label>
            )}

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'rgba(255, 255, 255, 0.4)' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Title, skills, keyword..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '280px', paddingLeft: '2.5rem' }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem', borderRadius: '12px' }}>Search</button>
            </form>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid rgba(99, 102, 241, 0.1)', 
            borderTopColor: 'var(--accent-primary)', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Searching matching positions...</p>
        </div>
      ) : error ? (
        <div className="error-message" style={{ maxWidth: '500px', margin: '3rem auto' }}>
          {error}
        </div>
      ) : displayedJobs.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(11, 15, 26, 0.3)' }}>
          <Briefcase size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Jobs Found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            We couldn't find any job listings. Try adjusting your search keyword or clearing the filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {displayedJobs.map(job => (
            <div key={job.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Job Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <span className={`badge ${getJobTypeBadge(job.job_type)}`}>
                  <Clock size={12} style={{ marginRight: '0.1rem' }} />
                  {job.job_type}
                </span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--text-muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem' 
                }}>
                  <Calendar size={12} />
                  {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              {/* Job Title & Company */}
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.6rem', lineHeight: '1.3' }}>{job.title}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Building size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>{job.employer_name}</span>
              </div>
              
              {/* Description Snippet */}
              <p style={{ 
                fontSize: '0.925rem', 
                marginBottom: '1.75rem', 
                color: 'var(--text-secondary)', 
                lineHeight: '1.6',
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden',
                flex: '1'
              }}>
                {job.description}
              </p>
              
              {/* Job Footer Actions & Location */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '1.25rem',
                marginTop: 'auto'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                  <MapPin size={14} style={{ color: 'var(--accent-teal)' }} />
                  <span>{job.location}</span>
                </div>
                
                <Link to={`/jobs/${job.id}`} className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', borderRadius: '10px', gap: '0.35rem' }}>
                  Details
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
