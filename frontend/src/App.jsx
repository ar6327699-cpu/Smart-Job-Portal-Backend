import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';
import JobDetails from './pages/JobDetails';
import { ArrowRight, Cpu, Zap, Users, Sparkles, Target, Star } from 'lucide-react';
import './App.css';

const Home = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3.5rem', paddingBottom: '5rem' }}>
      {/* Decorative ambient background glows */}
      <div className="glow-ambient" style={{ top: '20%', left: '10%', width: '300px', height: '300px', background: 'rgba(99, 102, 241, 0.15)' }} />
      <div className="glow-ambient" style={{ top: '50%', right: '15%', width: '350px', height: '350px', background: 'rgba(168, 85, 247, 0.12)' }} />

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '6rem', position: 'relative' }}>
        {/* Floating badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: '#818cf8',
          padding: '0.45rem 1rem',
          borderRadius: '99px',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.05)'
        }}>
          <Sparkles size={14} style={{ color: 'var(--accent-secondary)' }} />
          Next-Gen AI Job Matching Engine
        </div>

        <h1 style={{ 
          fontSize: '3.75rem', 
          lineHeight: 1.15, 
          letterSpacing: '-0.03em', 
          marginBottom: '1.5rem',
          maxWidth: '850px',
          margin: '0 auto 1.5rem'
        }}>
          Supercharge Your Career with <span className="text-gradient">AI Power</span>
        </h1>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '1.2rem', 
          maxWidth: '650px', 
          margin: '0 auto 2.5rem',
          lineHeight: '1.7'
        }}>
          Our intelligent matchmaking system analyzes your unique skillset and automatically pairs you with perfect-fit opportunities. Set your skills, flip a switch, and let your dream job find you.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/jobs" className="btn-primary" style={{ padding: '0.9rem 2.2rem', borderRadius: '12px', fontSize: '1rem' }}>
            Explore Jobs
            <ArrowRight size={18} />
          </Link>
          {!user && (
            <Link to="/register" className="btn-outline" style={{ padding: '0.9rem 2.2rem', borderRadius: '12px', fontSize: '1rem' }}>
              Create Free Account
            </Link>
          )}
        </div>

        {/* Dashboard quick-link for logged-in users */}
        {user && (
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/profile" style={{ color: 'var(--accent-teal)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.95rem' }}>
              Go to Your Dashboard <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>

      {/* Feature Grid */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>
          Engineered for <span className="text-gradient-purple" style={{fontWeight: 800}}>Speed & Precision</span>
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem' 
        }}>
          {/* Feature 1 */}
          <div className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              marginBottom: '0.5rem'
            }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem' }}>Semantic Skill Matching</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              We don't just search for keywords. Our AI understands contextual skills and matches candidates based on project experience, technologies, and exact capabilities.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.15)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-teal)',
              marginBottom: '0.5rem'
            }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem' }}>AI Auto-Apply</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Turn on the automated pilot mode. When employers post jobs that match 50% or more of your target skills, our intelligent engine auto-submits your application instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.15)',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-secondary)',
              marginBottom: '0.5rem'
            }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem' }}>Smarter Sourcing</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              For employers, our portal acts as a perfect-fit filter. It lists pre-ranked candidates based on matching score, meaning zero hours wasted filtering irrelevant resumes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-job" element={<PostJob />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
