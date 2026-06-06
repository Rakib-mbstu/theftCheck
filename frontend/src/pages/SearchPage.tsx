import { useState } from 'react'
import api from '../helper/api'

interface SearchResult {
  imei: string
  brand: string
  model: string
  isStolen: boolean
  complaints: { id: number; locationStolen: string; createdAt: string }[]
}

export default function SearchPage() {
  const [imei, setImei]     = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const search = async () => {
    const trimmed = imei.trim()
    if (!trimmed) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await api.get('/search', { params: { imei: trimmed } })
      setResult(data)
    } catch (e: any) {
      setError(
        e.response?.status === 404
          ? 'No device found with that IMEI'
          : e.response?.data?.message ?? 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg pb-16">
      {/* Hero */}
      <div className="bg-brand-primary py-12 sm:py-16 px-4 text-center">
        <h1 className="text-white text-2xl sm:text-4xl font-bold mb-3">
          Check if a phone is stolen
        </h1>
        <p className="text-blue-200 text-sm sm:text-base max-w-md mx-auto">
          Search our registry by IMEI number to see if a device has been reported stolen
        </p>
      </div>

      {/* Search card */}
      <div className="max-w-xl mx-auto px-4 -mt-6">
        <div className="bg-brand-card rounded-2xl shadow-card-md border border-brand-border p-5 sm:p-6">
          <div className="flex flex-col gap-3">
            <input
              className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary placeholder-brand-muted font-mono"
              value={imei}
              onChange={e => setImei(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="e.g. 356938035643809"
              maxLength={15}
            />

            <button
              className="w-full py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 border-0 cursor-pointer text-sm"
              onClick={search}
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Check IMEI'}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-brand-muted flex items-center gap-2">
              <span className="text-brand-accent">⚠</span> {error}
            </p>
          )}
        </div>

        {/* Result card */}
        {result && (
          <div className={`mt-4 bg-brand-card rounded-2xl border shadow-card-md overflow-hidden
            ${result.isStolen ? 'border-brand-danger' : 'border-brand-border'}`}>

            {result.isStolen && (
              <div className="bg-brand-danger px-5 py-3 flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-wide">⚠️ REPORTED STOLEN</span>
              </div>
            )}

            {!result.isStolen && (
              <div className="bg-brand-success px-5 py-3 flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-wide">✓ NOT REPORTED STOLEN</span>
              </div>
            )}

            <div className="p-5">
              <h2 className="text-brand-text text-xl font-bold mb-1">{result.brand} {result.model}</h2>
              <p className="text-brand-muted text-xs mb-3">
                IMEI: <span className="text-brand-text font-mono font-medium">{result.imei}</span>
              </p>

              {result.isStolen && result.complaints.length > 0 && (
                <div className="mt-4 border-t border-brand-border pt-4">
                  <p className="text-xs font-semibold text-brand-text uppercase tracking-wide mb-2">
                    {result.complaints.length} Stolen Report{result.complaints.length > 1 ? 's' : ''}
                  </p>
                  {result.complaints.map(c => (
                    <div key={c.id} className="bg-red-50 border border-red-100 rounded-lg p-3 mb-2">
                      <p className="text-brand-text text-sm mb-0.5">📍 {c.locationStolen}</p>
                      <p className="text-brand-muted text-xs">
                        Reported: {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
