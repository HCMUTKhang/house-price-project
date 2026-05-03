export default function CityTable({ cities }) {
  const max = Math.max(...cities.map(c => c.median))
  const min = Math.min(...cities.map(c => c.median))
  const fmt = v => `$${(v / 1000).toFixed(0)}K`

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      <h3 className="card-title">Median Price by City — Top 15</h3>
      <table className="city-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Median Price</th>
            <th>Listings</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cities.map((c, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 500 }}>{c.city}</td>
              <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{fmt(c.median)}</td>
              <td style={{ color: 'var(--muted)' }}>{c.count}</td>
              <td>
                {c.median === max && <span className="pill pill-hi">Highest</span>}
                {c.median === min && <span className="pill pill-lo">Lowest</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}