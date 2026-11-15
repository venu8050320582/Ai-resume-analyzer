import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import api from '../services/api'
import type { ScreeningResult } from '../types'

export default function ResultDetails() {
  const { id } = useParams()
  const [result, setResult] = useState<ScreeningResult | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { api.get(`/api/screening/${id}`).then(({ data }) => setResult(data)).catch(() => setError('Screening result not found.')) }, [id])
  if (error) return <div className="alert error">{error}</div>
  if (!result) return <div className="loading-state">Loading screening details...</div>
  const score = Math.max(0, Math.min(100, result.matchScore || 0))
  const list = (value?: string) => value ? value.split(',').map(s => s.trim()).filter(Boolean) : []
  return <><div className="page-title-row"><div><Link to="/results" className="back-link"><ArrowLeft size={15} /> Back to results</Link><div className="eyebrow">SCREENING REPORT</div><h1>Candidate screening #{result.id}</h1><p>AI-assisted resume and job comparison.</p></div></div><div className="report-grid"><section className="panel score-panel"><div className="eyebrow">OVERALL MATCH</div><div className="score-ring" style={{ background: `conic-gradient(#6759e8 ${score * 3.6}deg, #edf0f6 0deg)` }}><div><strong>{Math.round(score)}%</strong><span>Match score</span></div></div><div className="report-meta">Resume #{result.resumeId} · Job #{result.jobId}</div><span className="status-pill complete">{result.status || 'COMPLETED'}</span></section><section className="panel summary-panel"><div className="panel-heading"><div><h3><Sparkles size={18} /> AI candidate summary</h3><p>Generated from the resume and job description.</p></div></div><p className="summary-copy">{result.candidateSummary || 'No candidate summary was returned.'}</p><div className="skill-columns"><div><h4><CheckCircle2 size={16} /> Matching skills</h4>{list(result.matchingSkills).length ? list(result.matchingSkills).map(s => <span className="skill-item match" key={s}>{s}</span>) : <p className="muted-text">No matching skills listed.</p>}</div><div><h4><XCircle size={16} /> Missing skills</h4>{list(result.missingSkills).length ? list(result.missingSkills).map(s => <span className="skill-item missing" key={s}>{s}</span>) : <p className="muted-text">No missing skills listed.</p>}</div></div></section></div></>
}
