import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../helper/api'

const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-text text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary placeholder-brand-muted font-mono'
const textInputClass = 'w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white text-brand-text text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary placeholder-brand-muted'
const labelClass = 'block text-brand-text text-xs font-semibold uppercase tracking-wide mt-4 mb-1'

export default function NewComplaintPage() {
  const navigate = useNavigate()

  const [imei, setImei]           = useState('')
  const [brand, setBrand]         = useState('')
  const [model, setModel]         = useState('')
  const [location, setLocation]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [warning, setWarning]     = useState('')

  const submit = async () => {
    if (!imei || !brand || !model || !location) { setError('All fields are required'); return }
    setSubmitting(true)
    setError('')
    setWarning('')
    try {
      await api.post('/complaints', { imei: imei.trim(), brand: brand.trim(), model: model.trim(), locationStolen: location.trim() })
      navigate('/complaints')
    } catch (e: any) {
      if (e.response?.status === 409) {
        setWarning(e.response.data?.error ?? 'You already have an open complaint for this device')
      } else {
        setError(e.response?.data?.error ?? 'Failed to submit complaint')
      }
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg pb-12">
      <div className="bg-brand-primary py-8 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1">Report a Stolen Phone</h1>
          <p className="text-blue-200 text-sm">
            Your complaint will be reviewed by an admin before appearing in the public registry.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        <div className="bg-brand-card rounded-2xl shadow-card-md border border-brand-border p-5 sm:p-7">

          <label className={labelClass}>IMEI Number</label>
          <input className={inputClass} placeholder="15-digit IMEI (e.g. 356938035643809)"
            maxLength={15} value={imei} onChange={e => setImei(e.target.value)} />

          <label className={labelClass}>Brand</label>
          <input className={textInputClass} placeholder="e.g. Samsung" maxLength={100}
            value={brand} onChange={e => setBrand(e.target.value)} />

          <label className={labelClass}>Model</label>
          <input className={textInputClass} placeholder="e.g. Galaxy S24" maxLength={100}
            value={model} onChange={e => setModel(e.target.value)} />

          <label className={labelClass}>Location Stolen</label>
          <input className={textInputClass} placeholder="City, area, or address" maxLength={200}
            value={location} onChange={e => setLocation(e.target.value)} />

          {warning && (
            <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <span className="text-brand-accent text-base leading-none mt-0.5">⚠</span>
              <p className="text-amber-800 text-xs">{warning}</p>
            </div>
          )}
          {error && (
            <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <span className="text-brand-danger text-base leading-none mt-0.5">✕</span>
              <p className="text-red-700 text-xs">{error}</p>
            </div>
          )}

          <button
            className="mt-6 w-full bg-brand-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 border-0 cursor-pointer text-sm"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit Complaint'}
          </button>
        </div>
      </div>
    </div>
  )
}
