import { useEffect, useState } from 'react'
import { Search, Sparkles, FileText, BriefcaseBusiness, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import type { Job, ScreeningResult } from '../types'

export default function Results() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobId, setJobId] = useState('')
  const [results, setResults] = useState<ScreeningResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { api.get('/api/jobs').then(({ data }) => { const list = Array.isArray(data) ? data : []; setJobs(list); if (list.length) setJobId(String(list[0].id)) }).catch(() => setError('Unable to load jobs.')) }, [])
  useEffect(() => {
    if (!jobId) return
    setLoading(true); setError('')
    api.get(`/api/screening/job/${jobId}`).then(({ data }) => setResults(Array.isArray(data) ? data : []))
      .catch(err => { setResults([]); setError(err.response?.data?.message || 'No screening results could be loaded for this job.') })
      .finally(() => setLoading(false))
  }, [jobId])

  return <>
    <div className="page-title-row"><div><div className="eyebrow">AI INSIGHTS</div><h1>Screening results</h1><p>Review candidate match scores and AI-generated summaries.</p></div></div>
    <section className="panel results-panel">
      <div className="results-filter"><div><h3>Candidate rankings</h3><p>Results are sorted by match score when returned by the backend.</p></div><div className="select-with-icon"><BriefcaseBusiness size={16} /><select value={jobId} onChange={e => setJobId(e.target.value)}><option value="">Choose job</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</select></div></div>
      {error && <div className="alert error">{error}</div>}
      {loading ? <div className="loading-state">Loading screening results...</div> : results.length === 0 ? <div className="empty-state compact"><div className="empty-icon"><Sparkles /></div><strong>No screening results yet</strong><p>Upload a resume and run AI screening against this job to see candidate insights here.</p><Link to="/upload" className="btn btn-secondary btn-small"><FileText size={15} /> Upload resume</Link></div> :
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Candidate / Result</th><th>Resume ID</th><th>Match score</th><th>Status</th><th>Created</th><th></th></tr></thead><tbody>{results.map(r => <tr key={r.id}><td><strong>Screening #{r.id}</strong><small className="table-sub">{r.candidateSummary || 'AI screening summary available'}</small></td><td>#{r.resumeId}</td><td><div className="score-cell"><strong>{Math.round(r.matchScore || 0)}%</strong><div className="score-track"><span style={{ width: `${Math.max(0, Math.min(100, r.matchScore || 0))}%` }} /></div></div></td><td><span className={`status-pill ${r.status === 'COMPLETED' ? 'complete' : ''}`}>{r.status || 'COMPLETED'}</span></td><td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td><td><Link to={`/results/${r.id}`} className="icon-button"><ArrowUpRight size={17} /></Link></td></tr>)}</tbody></table></div>}
    </section>
  </>
}
