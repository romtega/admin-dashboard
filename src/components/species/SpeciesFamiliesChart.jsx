import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Fabaceae", numero: 16 },
  { name: "Cucurbitaceae", numero: 10 },
  { name: "Asteraceae", numero: 20 },
  { name: "Solanaceae", numero: 5 },
  { name: "Rosaceae", numero: 1 },
  { name: "Poaceae", numero: 23 },
]

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
]

const SpeciesFamiliesChart = () => {
  return (
    <motion.div
      className="bg-[#2E3D36] backdrop-blur-md shadow-md rounded-xl p-6 border border-[#5F7A6A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="mb-4 text-lg font-medium text-white">Familias</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="numero"
              label={({ name, percent }) => {
                return `${name} ${(percent * 100).toFixed(0)}%`
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default SpeciesFamiliesChart
