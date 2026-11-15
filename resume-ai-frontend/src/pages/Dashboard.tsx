import { useEffect, useState } from 'react'
import { ArrowUpRight, BriefcaseBusiness, FileText, Sparkles, Users, Plus, UploadCloud, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import type { Job } from '../types'
import StatCard from '../components/StatCard'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/jobs').then(({ data }) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load jobs. Check that the backend is running and CORS is configured.'))
  }, [])

  return (
    <>
      <div className="welcome-row">
        <div><div className="eyebrow">OVERVIEW</div><h1>Good to see you, {user?.fullName?.split(' ')[0] || 'there'} <span className="wave">✦</span></h1><p>Here's what's happening in your recruitment workspace.</p></div>
        <Link to="/jobs/new" className="btn btn-primary"><Plus size={17} /> Create a job</Link>
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="stats-grid">
        <StatCard label="Active job openings" value={jobs.length} note="Roles in your workspace" icon={BriefcaseBusiness} tone="purple" />
        <StatCard label="Resume workflow" value="Ready" note="Upload resumes to get started" icon={FileText} tone="blue" />
        <StatCard label="AI screening" value="Available" note="Gemini-powered analysis" icon={Sparkles} tone="green" />
        <StatCard label="Your access" value={user?.role || 'RECRUITER'} note="Role-based workspace access" icon={Users} tone="orange" />
      </div>
      <div className="dashboard-grid">
        <section className="panel recent-panel">
          <div className="panel-heading"><div><h3>Recent job openings</h3><p>Manage the roles you're hiring for.</p></div><Link to="/jobs" className="text-link">View all <ArrowUpRight size={15} /></Link></div>
          {jobs.length === 0 ? <div className="empty-state compact"><div className="empty-icon"><BriefcaseBusiness /></div><strong>No jobs added yet</strong><p>Create your first job opening to begin screening candidates.</p><Link to="/jobs/new" className="btn btn-secondary btn-small"><Plus size={15} /> Create job</Link></div> :
            <div className="job-list">{jobs.slice(0, 5).map(job => <Link to={`/jobs/${job.id}`} className="job-row" key={job.id}><div className="company-avatar">{job.companyName?.charAt(0)?.toUpperCase() || 'C'}</div><div className="job-row-main"><strong>{job.title}</strong><span>{job.companyName} {job.location ? `· ${job.location}` : ''}</span></div><span className="status-pill">Open</span><ChevronRight size={17} className="muted-icon" /></Link>)}</div>}
        </section>
        <section className="panel quick-panel">
          <div className="panel-heading"><div><h3>Quick actions</h3><p>Keep your hiring moving.</p></div></div>
          <Link to="/jobs/new" className="quick-action"><div className="quick-icon violet"><BriefcaseBusiness size={19} /></div><div><strong>Create job opening</strong><span>Define role requirements</span></div><ArrowUpRight size={17} /></Link>
          <Link to="/upload" className="quick-action"><div className="quick-icon cyan"><UploadCloud size={19} /></div><div><strong>Upload a resume</strong><span>Add a candidate profile</span></div><ArrowUpRight size={17} /></Link>
          <Link to="/results" className="quick-action"><div className="quick-icon mint"><Sparkles size={19} /></div><div><strong>Review AI results</strong><span>Explore candidate matches</span></div><ArrowUpRight size={17} /></Link>
          <div className="tip-card"><Sparkles size={17} /><p><strong>Helpful tip</strong><br />Add clear required skills to each job for more useful AI screening insights.</p></div>
        </section>
      </div>
    </>
  )
}
