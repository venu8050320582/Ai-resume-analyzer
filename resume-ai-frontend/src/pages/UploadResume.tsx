import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UploadCloud, FileText, X, Sparkles, CheckCircle2 } from 'lucide-react'
import api from '../services/api'
import type { Job, ResumeUploadResponse } from '../types'

export default function UploadResume() {
  const [searchParams] = useSearchParams()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobId, setJobId] = useState(searchParams.get('jobId') || '')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resumeId, setResumeId] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { api.get('/api/jobs').then(({ data }) => setJobs(Array.isArray(data) ? data : [])).catch(() => setError('Could not load jobs.')) }, [])

  function acceptFile(next: File | undefined) {
    setError(''); setMessage(''); setResumeId(null)
    if (!next) return
    const valid = next.name.toLowerCase().endsWith('.pdf') || next.name.toLowerCase().endsWith('.docx')
    if (!valid) { setError('Please select a PDF or DOCX file.'); return }
    if (next.size > 5 * 1024 * 1024) { setError('File must be 5 MB or smaller.'); return }
    setFile(next)
  }
  function onFileChange(e: ChangeEvent<HTMLInputElement>) { acceptFile(e.target.files?.[0]) }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(''); setMessage(''); setResumeId(null)
    if (!file) { setError('Please choose a PDF or DOCX resume.'); return }
    const body = new FormData()
    body.append('fullName', fullName)
    body.append('email', email)
    if (phone) body.append('phone', phone)
    body.append('file', file)
    setLoading(true)
    try {
      const { data } = await api.post<ResumeUploadResponse>('/api/resumes/upload', body, { headers: { 'Content-Type': 'multipart/form-data' } })
      const id = Number(data.id ?? data.resumeId)
      if (Number.isFinite(id) && id > 0) setResumeId(id)
      setMessage(data.message || 'Resume uploaded and text extracted successfully.')
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Upload failed. Check file type, size and backend connection.')
    } finally { setLoading(false) }
  }

  async function analyze() {
    if (!resumeId || !jobId) return
    setLoading(true); setError('')
    try {
      const { data } = await api.post(`/api/ai/analyze/${resumeId}/${jobId}`)
      setMessage(`AI screening completed. Score: ${data.score?.totalScore !== undefined ? data.score.totalScore : 'Check results page'}`)
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'AI screening failed. Check Gemini quota and backend logs.')
    } finally { setLoading(false) }
  }

  return <>
    <div className="page-title-row"><div><div className="eyebrow">CANDIDATE PIPELINE</div><h1>Upload a resume</h1><p>Add candidate details and let AI compare the resume with a job opening.</p></div></div>
    <div className="upload-layout">
      <form className="panel upload-form" onSubmit={submit}>
        <div className="section-heading"><div className="step-number">01</div><div><h3>Candidate information</h3><p>Enter the candidate's contact details.</p></div></div>
        <div className="form-grid">
          <div className="form-field"><label>Full name *</label><input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Candidate full name" required /></div>
          <div className="form-field"><label>Email address *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="candidate@email.com" required /></div>
          <div className="form-field"><label>Phone number</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional phone number" /></div>
        </div>
        <div className="section-heading section-spaced"><div className="step-number">02</div><div><h3>Upload resume</h3><p>PDF or DOCX, maximum file size 5 MB.</p></div></div>
        <div className={`dropzone ${dragging ? 'dragging' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files?.[0]) }} onClick={() => inputRef.current?.click()}>
          <input ref={inputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden onChange={onFileChange} />
          {file ? <><div className="file-icon"><FileText /></div><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB</span><button type="button" className="remove-file" onClick={e => { e.stopPropagation(); setFile(null) }}><X size={15} /> Remove</button></> : <><div className="upload-icon"><UploadCloud size={25} /></div><strong>Drop your resume here, or <span>browse</span></strong><p>PDF or DOCX · Up to 5 MB</p></>}
        </div>
        <div className="form-actions"><button className="btn btn-primary" disabled={loading}>{loading ? 'Uploading...' : <><UploadCloud size={17} /> Upload resume</>}</button></div>
        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success"><CheckCircle2 size={17} />{message}</div>}
        {resumeId && <div className="screening-next"><div><strong>Resume saved</strong><span>Resume ID: {resumeId}. Select a job to start AI screening.</span></div><div className="form-field"><label>Job opening</label><select value={jobId} onChange={e => setJobId(e.target.value)}><option value="">Choose a job</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.companyName}</option>)}</select></div><button type="button" className="btn btn-primary" disabled={!jobId || loading} onClick={analyze}><Sparkles size={16} /> Analyze with AI</button></div>}
      </form>
      <aside className="panel upload-aside"><div className="aside-art"><Sparkles size={28} /></div><h3>From resume to insight</h3><p>Once uploaded, the backend extracts resume text and sends it with the selected job requirements for AI-assisted analysis.</p><div className="process-list"><div><span>1</span><div><strong>Upload</strong><small>Securely submit candidate file to your API.</small></div></div><div><span>2</span><div><strong>Extract</strong><small>Read text from PDF or DOCX.</small></div></div><div><span>3</span><div><strong>Analyze</strong><small>Compare skills, experience and education.</small></div></div></div><div className="privacy-note">AI screening supports human review. It should not make hiring decisions on its own.</div></aside>
    </div>
  </>
}
