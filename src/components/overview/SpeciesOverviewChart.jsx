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
import { usePlantContext } from "@/hooks/usePlantContext"

const SpeciesOverviewChart = () => {
  const { plantsData } = usePlantContext()

  const getMonthlyData = () => {
    const monthlyTotals = Array(12).fill(0)

    const thisYear = new Date().getFullYear()
    plantsData.forEach(plant => {
      const date = new Date(plant.createdAt)
      if (date.getFullYear() === thisYear) {
        const month = date.getMonth() // 0 = Ene, 11 = Dic
        monthlyTotals[month] += 1
      }
    })

    const accumulated = []
    let runningTotal = 0
    const monthLabels = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ]

    for (let i = 0; i < 12; i++) {
      runningTotal += monthlyTotals[i]
      accumulated.push({
        name: monthLabels[i],
        Cantidad: runningTotal,
      })
    }

    return accumulated
  }

  return (
    <motion.div
      className="bg-[#2E3D36] backdrop-blur-md shadow-md rounded-xl p-6 border border-[#5F7A6A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="mb-4 text-lg font-medium text-white">
        Numero de Especies
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getMonthlyData()}>
            <CartesianGrid strokeDasharray="5 5" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#B3C7BF" />
            <YAxis stroke="#B3C7BF" />
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
      </div>
    </motion.div>
  )
}

export default SpeciesOverviewChart
