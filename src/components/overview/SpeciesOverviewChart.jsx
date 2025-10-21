// SpeciesOverviewChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import axiosInstance from "@/services/axiosConfig"

const SpeciesOverviewChart = () => {
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
        const year = new Date().getFullYear()
        // Puedes pasar cumulative=false si quieres valores mensuales no acumulados
        const res = await axiosInstance.get(
          `/api/v1/plants/stats/monthly?year=${year}&cumulative=true`,
          { signal: controller.signal }
        )
        setData(res.data?.data ?? [])
      } catch (err) {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          console.error("Error cargando stats mensuales:", err)
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

  return (
    <motion.div
      className="bg-[#2E3D36] backdrop-blur-md shadow-md rounded-xl p-6 border border-[#5F7A6A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="mb-4 text-lg font-medium text-white">
        Número de Especies
      </h2>
      <div className="h-80">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            Cargando…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="5 5" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#B3C7BF" />
              <YAxis stroke="#B3C7BF" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2E3D36",
                  borderColor: "#5F7A6A",
                }}
                itemStyle={{ color: "#B3C7BF" }}
              />
              <Line
                type="monotone"
                dataKey="Cantidad"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: "#22C55E", strokeWidth: 3, r: 3 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}

export default SpeciesOverviewChart
