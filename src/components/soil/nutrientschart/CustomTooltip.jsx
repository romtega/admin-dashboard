const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload
    return (
      <div
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.8)",
          border: "1px solid #4B5563",
          padding: "10px",
          borderRadius: "8px",
          color: "#E5E7EB",
        }}
      >
        <p style={{ marginBottom: 4 }}>
          <strong>{label}</strong>
        </p>
        <p>Valor actual: {entry.value} ppm</p>
        <p>
          Rango óptimo: {entry.optimMin} – {entry.optimMax} ppm
        </p>
      </div>
    )
  }
  return null
}

export default CustomTooltip
