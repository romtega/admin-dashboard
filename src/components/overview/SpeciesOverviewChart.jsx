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

const SpeciesData = [
  { name: "Ene", Cantidad: 0 },
  { name: "Feb", Cantidad: 10 },
  { name: "Mar", Cantidad: 24 },
  { name: "Abr", Cantidad: 26 },
  { name: "May", Cantidad: 30 },
  { name: "Jun", Cantidad: 48 },
  { name: "Jul", Cantidad: 66 },
  { name: "Ago", Cantidad: 124 },
  { name: "Sep", Cantidad: 135 },
  { name: "Oct", Cantidad: 135 },
  { name: "Nov", Cantidad: 167 },
  { name: "Div", Cantidad: 200 },
]
const SpeciesOverviewChart = () => {
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
          <LineChart data={SpeciesData}>
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
