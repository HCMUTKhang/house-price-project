export default function MetricCard({ label, value }) {
  return (
    <div className="metric">
      <div className="m-label">{label}</div>
      <div className="m-value">{value}</div>
    </div>
  )
}