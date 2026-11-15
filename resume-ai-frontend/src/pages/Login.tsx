import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { AuthUser } from '../types'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      if (!data.token) throw new Error('Login response did not contain a JWT token.')
      const user: AuthUser = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        token: data.token,
      }
      login(user)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Unable to sign in. Check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-brand"><div className="brand-mark"><Sparkles size={20} /></div>Talent<span>IQ</span></div>
        <div className="auth-visual-content">
          <div className="eyebrow light"><span /> INTELLIGENT HIRING PLATFORM</div>
          <h1>Find the talent<br /><em>behind the resume.</em></h1>
          <p>Bring your hiring workflow together. Organize roles, screen resumes with AI, and make clearer decisions.</p>
          <div className="visual-metrics">
            <div><strong>AI</strong><span>Resume insights</span></div>
            <div><strong>360°</strong><span>Candidate view</span></div>
            <div><strong>1</strong><span>Unified workspace</span></div>
          </div>
        </div>
        <div className="visual-orb orb-one" /><div className="visual-orb orb-two" />
        <div className="auth-visual-footer">Designed for teams that hire thoughtfully.</div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><div className="brand-mark"><Sparkles size={18} /></div>Talent<span>IQ</span></div>
          <div className="auth-heading"><div className="eyebrow">WELCOME BACK</div><h2>Sign in to your account</h2><p>Enter your details to continue to your workspace.</p></div>
          <form onSubmit={submit} className="auth-form">
            <label>Email address</label>
            <div className="field-with-icon"><Mail size={18} /><input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <label>Password</label>
            <div className="field-with-icon"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            {error && <div className="alert error">{error}</div>}
            <button className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Signing in...' : <>Sign in <ArrowRight size={17} /></>}</button>
          </form>
          <p className="auth-switch">Don't have an account? <Link to="/register">Create account</Link></p>
          <div className="auth-note"><LockKeyhole size={14} /> Your workspace is protected by secure authentication.</div>
        </div>
      </section>
    </div>
  )
}
