const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getStats() {
  const res = await fetch(`${API_BASE}/api/v1/stats`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export async function predictPrice(payload) {
  const res = await fetch(`${API_BASE}/api/v1/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Prediction failed')
  return res.json()
}