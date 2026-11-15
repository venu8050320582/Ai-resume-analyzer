import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MapPin, BriefcaseBusiness, ArrowUpRight, Pencil, Trash2 } from 'lucide-react'
import api from '../services/api'
import type { Job } from '../types'
import { useAuth } from '../context/AuthContext'

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()
  const load = () => api.get('/api/jobs').then(({ data }) => setJobs(Array.isArray(data) ? data : [])).catch(() => setError('Unable to load jobs. Check your backend connection.'))
  useEffect(() => { load() }, [])

  async function remove(id: number) {
    if (!window.confirm('Delete this job opening?')) return
    try { await api.delete(`/api/jobs/${id}`); load() }
    catch (err: any) { setError(err.response?.data?.message || 'Unable to delete this job. Admin access may be required.') }
  }

  const filtered = jobs.filter(j => `${j.title} ${j.companyName} ${j.requiredSkills}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <div className="page-title-row"><div><div className="eyebrow">RECRUITMENT</div><h1>Job openings</h1><p>Create and manage the roles you're hiring for.</p></div><Link to="/jobs/new" className="btn btn-primary"><Plus size={17} /> Add job opening</Link></div>
      {error && <div className="alert error">{error}</div>}
      <div className="toolbar"><div className="search-box"><Search size={18} /><input placeholder="Search jobs, companies or skills..." value={query} onChange={e => setQuery(e.target.value)} /></div><span className="result-count">{filtered.length} {filtered.length === 1 ? 'opening' : 'openings'}</span></div>
      {filtered.length === 0 ? <div className="panel empty-state"><div className="empty-icon"><BriefcaseBusiness /></div><strong>{jobs.length ? 'No matching jobs' : 'No job openings yet'}</strong><p>{jobs.length ? 'Try another search term.' : 'Create your first opening and start building your candidate pipeline.'}</p>{!jobs.length && <Link to="/jobs/new" className="btn btn-primary btn-small"><Plus size={15} /> Add your first job</Link>}</div> :
        <div className="jobs-grid">{filtered.map(job => <article className="job-card" key={job.id}><div className="job-card-top"><div className="company-avatar large">{job.companyName?.charAt(0)?.toUpperCase() || 'C'}</div><span className="status-pill">Active</span></div><h3>{job.title}</h3><div className="company-name">{job.companyName}</div><div className="job-meta">{job.location && <span><MapPin size={14} />{job.location}</span>}{job.experienceRequired && <span><BriefcaseBusiness size={14} />{job.experienceRequired}</span>}</div><p className="job-description">{job.description}</p><div className="skill-tags">{job.requiredSkills?.split(',').slice(0, 4).map(s => <span key={s}>{s.trim()}</span>)}</div><div className="job-card-footer"><Link to={`/jobs/${job.id}`} className="text-link">View details <ArrowUpRight size={15} /></Link><div className="card-actions"><Link to={`/jobs/${job.id}/edit`} className="icon-button" title="Edit"><Pencil size={16} /></Link>{user?.role === 'ADMIN' && <button className="icon-button danger-hover" title="Delete" onClick={() => remove(job.id)}><Trash2 size={16} /></button>}</div></div></article>)}</div>}
    </>
  )
}
