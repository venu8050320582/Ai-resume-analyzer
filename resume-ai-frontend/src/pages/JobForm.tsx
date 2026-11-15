import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import api from '../services/api'
import type { Job } from '../types'

const blank: Partial<Job> = { title: '', companyName: '', description: '', requiredSkills: '', experienceRequired: '', educationRequirement: '', location: '' }

export default function JobForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const [form, setForm] = useState<Partial<Job>>(blank)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) api.get(`/api/jobs/${id}`).then(({ data }) => setForm(data)).catch(() => setError('Unable to load this job.'))
  }, [id])

  function change(key: keyof Job, value: string) { setForm(current => ({ ...current, [key]: value })) }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (editing) await api.put(`/api/jobs/${id}`, form)
      else await api.post('/api/jobs', form)
      navigate('/jobs')
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Unable to save job. Check required fields and backend logs.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="page-title-row"><div><Link to="/jobs" className="back-link"><ArrowLeft size={15} /> Back to jobs</Link><div className="eyebrow">{editing ? 'EDIT ROLE' : 'NEW OPPORTUNITY'}</div><h1>{editing ? 'Update job opening' : 'Create job opening'}</h1><p>Add the details candidates will be screened against.</p></div></div>
      <form className="panel form-panel" onSubmit={submit}>
        {error && <div className="alert error">{error}</div>}
        <div className="form-grid">
          <div className="form-field"><label>Job title *</label><input value={form.title || ''} onChange={e => change('title', e.target.value)} placeholder="e.g. Java Full Stack Developer" required /></div>
          <div className="form-field"><label>Company name *</label><input value={form.companyName || ''} onChange={e => change('companyName', e.target.value)} placeholder="Company name" required /></div>
          <div className="form-field full"><label>Job description *</label><textarea rows={4} value={form.description || ''} onChange={e => change('description', e.target.value)} placeholder="Describe the role, responsibilities and expectations..." required /></div>
          <div className="form-field full"><label>Required skills *</label><input value={form.requiredSkills || ''} onChange={e => change('requiredSkills', e.target.value)} placeholder="Java, Spring Boot, React, MySQL" required /><small>Separate skills with commas to help AI screening identify relevant matches.</small></div>
          <div className="form-field"><label>Experience required</label><input value={form.experienceRequired || ''} onChange={e => change('experienceRequired', e.target.value)} placeholder="e.g. Fresher / 2+ years" /></div>
          <div className="form-field"><label>Education requirement</label><input value={form.educationRequirement || ''} onChange={e => change('educationRequirement', e.target.value)} placeholder="e.g. B.Tech / Any degree" /></div>
          <div className="form-field"><label>Location</label><input value={form.location || ''} onChange={e => change('location', e.target.value)} placeholder="e.g. Bengaluru / Remote" /></div>
        </div>
        <div className="form-actions"><Link to="/jobs" className="btn btn-ghost">Cancel</Link><button className="btn btn-primary" disabled={loading}><Save size={16} />{loading ? 'Saving...' : editing ? 'Save changes' : 'Create job'}</button></div>
      </form>
    </>
  )
}
