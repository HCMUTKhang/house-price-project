export default function BarChart({ title, data, labelKey, valueKey, formatValue, labelPrefix }) {
  const max = Math.max(...data.map(d => d[valueKey]))
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      {data.map((d, i) => {
        const pct = Math.round((d[valueKey] / max) * 100)
        const label = labelPrefix ? `${labelPrefix} ${d[labelKey]}` : d[labelKey]
        return (
          <div className="bar-row" key={i}>
            <div className="bar-label">{label}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="bar-val">{formatValue(d[valueKey])}</div>
          </div>
        )
      })}
    </div>
  )
}