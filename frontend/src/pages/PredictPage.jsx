import { useState } from 'react'
import { predictPrice } from '../api'

const DEFAULTS = {
  sqft_living: 1800, bedrooms: 3, bathrooms: 2.5, floors: 2,
  waterfront: 0, view: 0, condition: 3,
  sqft_above: 1500, sqft_basement: 0, house_age: 25,
  was_renovated: 0, model_type: 'RandomForest',
}

export default function PredictPage() {
  const [form, setForm] = useState(DEFAULTS)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const num = (k, v) => set(k, Number(v))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await predictPrice(form)
      setResult(data)
    } catch {
      setError('Could not reach the backend. Make sure it is running at the VITE_API_URL in your .env file.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Predict House Price</h1>
      <p className="sub">Enter property details to get an estimated market price from trained ML models.</p>

      {/* <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem', padding: '.6rem 1rem', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
        <span>Deployed automatically via <strong style={{ color: 'var(--text)' }}>GitHub Actions CI/CD</strong> — push to <code>main</code> triggers build &amp; deploy to EC2.</span>
      </div> */}

      <div className="predict-layout">
        {/* LEFT — form */}
        <form onSubmit={handleSubmit}>
          <div className="section-label">Property Size</div>
          <div className="form-grid">
            <div className="field">
              <label>Living Area (sqft)</label>
              <input type="number" value={form.sqft_living} onChange={e => num('sqft_living', e.target.value)} min="200" required />
            </div>
            <div className="field">
              <label>Above Ground (sqft)</label>
              <input type="number" value={form.sqft_above} onChange={e => num('sqft_above', e.target.value)} min="200" required />
            </div>
            <div className="field">
              <label>Basement (sqft)</label>
              <input type="number" value={form.sqft_basement} onChange={e => num('sqft_basement', e.target.value)} min="0" />
            </div>
            <div className="field">
              <label>Floors</label>
              <select value={form.floors} onChange={e => num('floors', e.target.value)}>
                {[1, 1.5, 2, 2.5, 3, 3.5].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="section-label">Rooms</div>
          <div className="form-grid">
            <div className="field">
              <label>Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={e => num('bedrooms', e.target.value)} min="1" max="10" />
            </div>
            <div className="field">
              <label>Bathrooms</label>
              <select value={form.bathrooms} onChange={e => num('bathrooms', e.target.value)}>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="section-label">Condition & Features</div>
          <div className="form-grid">
            <div className="field">
              <label>Condition (1–5)</label>
              <div className="range-row">
                <input type="range" min="1" max="5" step="1" value={form.condition} onChange={e => num('condition', e.target.value)} />
                <span className="range-val">{form.condition}</span>
              </div>
              <span className="hint">1 = Poor · 5 = Excellent</span>
            </div>
            <div className="field">
              <label>View Score (0–4)</label>
              <div className="range-row">
                <input type="range" min="0" max="4" step="1" value={form.view} onChange={e => num('view', e.target.value)} />
                <span className="range-val">{form.view}</span>
              </div>
              <span className="hint">0 = None · 4 = Excellent</span>
            </div>
            <div className="field">
              <label>Waterfront</label>
              <select value={form.waterfront} onChange={e => num('waterfront', e.target.value)}>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
            <div className="field">
              <label>House Age (years)</label>
              <input type="number" value={form.house_age} onChange={e => num('house_age', e.target.value)} min="0" max="150" />
              <span className="hint">2014 − year built</span>
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: '.85rem' }}>
            <div className="field">
              <label>Was Renovated?</label>
              <select value={form.was_renovated} onChange={e => num('was_renovated', e.target.value)}>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
            <div className="field">
              <label>Model</label>
              <select value={form.model_type} onChange={e => set('model_type', e.target.value)}>
                <option value="RandomForest">Random Forest</option>
                <option value="LinearRegression">Linear Regression</option>
                <option value="MLP">Neural Network (MLP)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Estimating...' : 'Estimate Price'}
          </button>
        </form>

        {/* RIGHT — result */}
        <div>
          {error && <div className="error-box">{error}</div>}

          {loading && (
            <div className="loading-box">
              <div style={{ marginBottom: '.75rem' }}>Calculating estimate...</div>
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          )}

          {result && (
            <div className="result-box">
              <div className="model-badge">{result.model_used}</div>
              <div className="result-label">Predicted Price</div>
              <div className="result-price">${result.data.predicted_price.toLocaleString()}</div>
              <div className="result-range">
                ±10% range: ${result.data.price_range.low.toLocaleString()} – ${result.data.price_range.high.toLocaleString()}
              </div>
              <div className="result-summary">
                <strong>{form.sqft_living} sqft</strong> · <strong>{form.bedrooms} bed</strong> · <strong>{form.bathrooms} bath</strong> · <strong>{form.floors} floor(s)</strong><br />
                Condition <strong>{form.condition}/5</strong> · View <strong>{form.view}/4</strong> · Age <strong>{form.house_age} yrs</strong><br />
                Waterfront: <strong>{form.waterfront ? 'Yes' : 'No'}</strong> · Renovated: <strong>{form.was_renovated ? 'Yes' : 'No'}</strong>
              </div>
            </div>
          )}

          <div className="card how-to" style={{ marginTop: result || error || loading ? '1.25rem' : 0 }}>
            <h3 className="card-title">How to use</h3>
            <ol>
              <li>Fill in property details on the left</li>
              <li>Choose a ML model (Random Forest recommended)</li>
              <li>Click <strong>Estimate Price</strong></li>
            </ol>
            <div style={{ marginTop: '.85rem', padding: '.7rem', background: 'var(--bg3)', borderRadius: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
              Backend endpoint: <span className="code">POST /api/v1/predict</span><br />
              {/* Set your backend URL in <span className="code">.env</span> → <span className="code">VITE_API_URL</span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}