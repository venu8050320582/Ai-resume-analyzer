import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail, UserRound, Sparkles } from 'lucide-react'
import api from '../services/api'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/register', { fullName, email, password })
      setSuccess(data.message || 'Account created successfully. You can now sign in.')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Check the details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-brand"><div className="brand-mark"><Sparkles size={20} /></div>Talent<span>IQ</span></div>
        <div className="auth-visual-content">
          <div className="eyebrow light"><span /> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Make every<br /><em>hire count.</em></h1>
          <p>Create your recruitment workspace and bring job management, resume uploads, and AI screening into one place.</p>
          <div className="visual-checks"><span>✓ Organize open roles</span><span>✓ Review candidate profiles</span><span>✓ Get AI-assisted resume insights</span></div>
        </div>
        <div className="visual-orb orb-one" /><div className="visual-orb orb-two" />
        <div className="auth-visual-footer">Thoughtful hiring. Better outcomes.</div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><div className="brand-mark"><Sparkles size={18} /></div>Talent<span>IQ</span></div>
          <div className="auth-heading"><div className="eyebrow">GET STARTED</div><h2>Create your account</h2><p>Set up your recruiter workspace in a moment.</p></div>
          <form onSubmit={submit} className="auth-form">
            <label>Full name</label>
            <div className="field-with-icon"><UserRound size={18} /><input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required /></div>
            <label>Email address</label>
            <div className="field-with-icon"><Mail size={18} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required /></div>
            <label>Password <span className="label-hint">At least 8 characters</span></label>
            <div className="field-with-icon"><LockKeyhole size={18} /><input type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required /></div>
            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}
            <button className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Creating account...' : <>Create account <ArrowRight size={17} /></>}</button>
          </form>
          <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
          <div className="auth-note"><LockKeyhole size={14} /> New accounts receive the Recruiter role by default.</div>
        </div>
      </section>
    </div>
  )
}
