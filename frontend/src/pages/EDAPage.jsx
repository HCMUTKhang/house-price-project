import { useEffect, useState } from 'react'
import { getStats } from '../api'
import MetricCard from '../components/MetricCard'
import BarChart from '../components/BarChart'
import CityTable from '../components/CityTable'

export default function EDAPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getStats().then(setStats).catch(() => setError('Could not load stats from backend.'))
  }, [])

  if (error) return <div className="page"><div className="error-box">{error}</div></div>
  if (!stats) return <div className="page" style={{ color: 'var(--muted)' }}>Loading...</div>

  const s = stats.summary
  const fmt = v => `$${(v / 1000).toFixed(0)}K`

  return (
    <div className="page">
      <h1>Dataset Insights</h1>
      <p className="sub">King County, WA — {s.total_transactions.toLocaleString()} transactions · {s.date_range}</p>

      <div className="grid4">
        <MetricCard label="Total Listings" value={s.total_transactions.toLocaleString()} />
        <MetricCard label="Median Price" value={`$${(s.median_price / 1000).toFixed(0)}K`} />
        <MetricCard label="Mean Price" value={`$${(s.mean_price / 1000).toFixed(0)}K`} />
        <MetricCard label="Max Price" value={`$${(s.max_price / 1000000).toFixed(2)}M`} />
      </div>

      <div className="grid2">
        <BarChart
          title="Price Distribution"
          data={stats.price_distribution}
          labelKey="range"
          valueKey="count"
          formatValue={v => v.toLocaleString()}
        />
        <BarChart
          title="Median Price by Bedrooms"
          data={stats.price_by_bedrooms}
          labelKey="bedrooms"
          valueKey="median"
          formatValue={fmt}
          labelPrefix="bed"
        />
      </div>

      <CityTable cities={stats.price_by_city.slice(0, 15)} />

      <div className="grid3">
        <BarChart
          title="Price by Living Area (sqft)"
          data={stats.price_by_sqft}
          labelKey="range"
          valueKey="median_price"
          formatValue={fmt}
        />

        <div className="card">
          <h3 className="card-title">Waterfront Premium</h3>
          <div className="wf-row">
            <div className="wf-box">
              <div className="wf-val accent">$947K</div>
              <div className="wf-lbl">Waterfront median<br />21 homes</div>
            </div>
            <div className="wf-box">
              <div className="wf-val">$460K</div>
              <div className="wf-lbl">Non-waterfront median<br />4,478 homes</div>
            </div>
          </div>
          <div className="wf-note">
            Waterfront premium: <strong style={{ color: 'var(--success)' }}>+106% above median</strong>
          </div>
        </div>

        <BarChart
          title="Median Price by View Score"
          data={stats.price_by_view}
          labelKey="view"
          valueKey="median"
          formatValue={fmt}
          labelPrefix="View"
        />
      </div>
    </div>
  )
}