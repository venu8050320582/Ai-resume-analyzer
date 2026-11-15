import type { LucideIcon } from 'lucide-react'

export default function StatCard({ label, value, note, icon: Icon, tone }: {
  label: string; value: string | number; note: string; icon: LucideIcon; tone: string
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  )
}
