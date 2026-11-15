import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BriefcaseBusiness, FileUp, ChartNoAxesCombined,
  LogOut, Sparkles, Users, Menu, X, UserCircle2
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const leave = () => {
    logout()
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/jobs', label: 'Job openings', icon: BriefcaseBusiness },
    { to: '/upload', label: 'Upload resume', icon: FileUp },
    { to: '/results', label: 'Screening results', icon: ChartNoAxesCombined },
  ]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={20} /></div>
          <span>Talent<span className="brand-accent">IQ</span></span>
          <button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Sparkles size={17} /></div>
            <strong>Smarter hiring starts here</strong>
            <p>Screen resumes and discover the right talent faster.</p>
          </div>
          <button className="nav-link logout-link" onClick={leave}><LogOut size={18} /><span>Sign out</span></button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>Recruitment</strong></div>
          <div className="topbar-user">
            <div className="avatar">{user?.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div className="user-meta"><strong>{user?.fullName}</strong><span>{user?.role || 'RECRUITER'}</span></div>
            <UserCircle2 size={19} className="user-icon" />
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
        <footer className="footer">© {new Date().getFullYear()} TalentIQ <span>AI-powered recruitment workspace</span></footer>
      </div>
    </div>
  )
}
