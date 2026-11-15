import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, BriefcaseBusiness, GraduationCap, Pencil, Sparkles } from 'lucide-react'
import api from '../services/api'
import type { Job } from '../types'

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { api.get(`/api/jobs/${id}`).then(({ data }) => setJob(data)).catch(() => setError('Job not found or could not be loaded.')) }, [id])
  if (error) return <div className="alert error">{error}</div>
  if (!job) return <div className="loading-state">Loading job details...</div>
  return <><div className="page-title-row"><div><Link to="/jobs" className="back-link"><ArrowLeft size={15} /> Back to jobs</Link><div className="eyebrow">JOB DETAILS</div><h1>{job.title}</h1><p>{job.companyName}</p></div><Link to={`/jobs/${job.id}/edit`} className="btn btn-secondary"><Pencil size={16} /> Edit job</Link></div><div className="panel details-panel"><div className="detail-meta">{job.location && <span><MapPin size={16} />{job.location}</span>}{job.experienceRequired && <span><BriefcaseBusiness size={16} />{job.experienceRequired}</span>}{job.educationRequirement && <span><GraduationCap size={16} />{job.educationRequirement}</span>}</div><h3>About the role</h3><p className="detail-description">{job.description}</p><h3>Required skills</h3><div className="skill-tags large-tags">{job.requiredSkills?.split(',').map(s => <span key={s}>{s.trim()}</span>)}</div><div className="detail-cta"><div><Sparkles size={19} /><div><strong>Ready to screen candidates?</strong><span>Upload a resume and compare it against this role.</span></div></div><Link to={`/upload?jobId=${job.id}`} className="btn btn-primary">Upload resume</Link></div></div></>
}
