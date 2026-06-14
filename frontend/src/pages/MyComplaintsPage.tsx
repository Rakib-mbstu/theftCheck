import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../helper/api'

interface Complaint {
  id: number
  locationStolen: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Resolved'
  createdAt: string
  device: { imei: string; brand: string; model: string }
}

const STATUS_META: Record<Complaint['status'], { label: string; note: string; badge: string; dot: string }> = {
  Pending:  {
    label: 'Pending Review',
    note:  'Your complaint is waiting for admin review.',
    badge: 'bg-amber-100 text-amber-800 border border-amber-200',
    dot:   'bg-brand-accent',
  },
  Approved: {
    label: 'Approved',
    note:  'Approved — visible in the public stolen registry.',
    badge: 'bg-red-100 text-red-700 border border-red-200',
    dot:   'bg-brand-danger',
  },
  Rejected: {
    label: 'Rejected',
    note:  'An admin has dismissed this complaint.',
    badge: 'bg-gray-100 text-gray-600 border border-gray-200',
    dot:   'bg-gray-400',
  },
  Resolved: {
    label: 'Resolved',
    note:  'Marked as resolved — device recovered.',
    badge: 'bg-green-100 text-green-700 border border-green-200',
    dot:   'bg-brand-success',
  },
}

function ComplaintCard({ c }: { c: Complaint }) {
  const meta = STATUS_META[c.status]
  return (
    <div className="bg-brand-card rounded-xl shadow-card border border-brand-border overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:p-5 border-b border-brand-border">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
          <span className="text-brand-text font-bold text-base">{c.device.brand} {c.device.model}</span>
        </div>
        <span className={`shrink-0 self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-brand-muted text-xs mb-1">
          IMEI: <span className="text-brand-text font-mono font-medium ml-1">{c.device.imei}</span>
        </p>
        <p className="text-brand-text text-sm mb-2">📍 {c.locationStolen}</p>
        <p className="text-xs italic text-brand-muted mb-3">{meta.note}</p>
        <p className="text-xs text-brand-muted border-t border-brand-border pt-3">
          Filed: {new Date(c.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/complaints/mine')
      .then(r => setComplaints(r.data))
      .catch(() => setError('Failed to load complaints'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-brand-bg pb-12">
      <div className="bg-brand-primary py-8 px-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-white text-2xl sm:text-3xl font-bold m-0">My Complaints</h1>
          <Link to="/complaints/new"
            className="bg-brand-accent text-brand-text text-sm font-semibold px-5 py-2.5 rounded-lg no-underline hover:bg-amber-400 transition-colors text-center">
            + File New Complaint
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        {loading && <div className="text-center py-12 text-brand-muted">Loading…</div>}
        {error   && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>}

        {!loading && complaints.length === 0 && !error && (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <div className="text-5xl">📋</div>
            <p className="text-brand-muted font-medium">No complaints filed yet.</p>
            <Link to="/complaints/new"
              className="bg-brand-primary text-white text-sm font-semibold px-6 py-2.5 rounded-lg no-underline hover:bg-blue-900 transition-colors">
              File your first complaint
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {complaints.map(c => <ComplaintCard key={c.id} c={c} />)}
        </div>
      </div>
    </div>
  )
}
