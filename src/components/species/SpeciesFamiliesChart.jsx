import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useEffect, useState, useRef } from "react"
import axiosInstance from "@/services/axiosConfig"

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
]

const SpeciesFamiliesChart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const abortRef = useRef(null)

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const run = async () => {
      try {
        setLoading(true)
        // incluye ?includeInactive=true si quieres contar también inactivas
        const res = await axiosInstance.get("/api/v1/plants/stats/families", {
          signal: controller.signal,
        })
        setData(res.data || [])
      } catch (err) {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          console.error("Error cargando stats:", err)
          setData([])
        }
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null
          setLoading(false)
        }
      }
    }
    run()
    return () => controller.abort()
  }, [])

  const safeLabel = ({ name, percent }) => {
    const pct = Number.isFinite(percent) ? (percent * 100).toFixed(0) : "0"
    return `${name} ${pct}%`
  }

  return (
    <motion.div
      className="bg-[#2E3D36] backdrop-blur-md shadow-md rounded-xl p-6 border border-[#5F7A6A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="mb-4 text-lg font-medium text-white">Familias (total)</h2>
      <div style={{ width: "100%", height: 300 }}>
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            Cargando…
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Sin datos
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="numero"
                label={safeLabel}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31,41,55,0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}

export default SpeciesFamiliesChart
