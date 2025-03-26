import {
  Bar,
  BarChart,
  CartesianGrid,
  Customized,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { motion } from "framer-motion"

import CustomTooltip from "./CustomTooltip"

const data = [
  { name: "Nitrógeno Nítrico", value: 4.15, optimMin: 10, optimMax: 30 },
  { name: "Nitrógeno Amoniacal", value: 35, optimMin: 25, optimMax: 50 },
  { name: "Fósforo", value: 25, optimMin: 20, optimMax: 40 },
  { name: "Potasio", value: 250, optimMin: 100, optimMax: 300 },
  { name: "Calcio", value: 1600, optimMin: 1000, optimMax: 2000 },
  { name: "Magnesio", value: 125, optimMin: 50, optimMax: 150 },
  { name: "Manganeso", value: 5, optimMin: 5, optimMax: 20 },
]

const OptimalRangeBackground = ({ y, height, xScale, data }) => {
  return (
    <>
      {data.map((entry, index) => {
        const barY = y(index)
        const barHeight = height
        const x1 = xScale(entry.optimMin)
        const x2 = xScale(entry.optimMax)
        const barWidth = x2 - x1

        return (
          <rect
            key={`bg-${index}`}
            x={x1}
            y={barY}
            width={barWidth}
            height={barHeight}
            fill="#10B981"
            fillOpacity={0.2}
            rx={4}
          />
        )
      })}
    </>
  )
}

const NutrientsChart = () => {
  return (
    <motion.div
      className="bg-[#2E3D36] backdrop-blur-md shadow-md rounded-xl p-6 border border-[#5F7A6A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="mb-4 text-lg font-medium text-white">
        Nutrientes Disponibles
      </h2>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" scale="log" domain={[1, 2000]} />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Fondo visual para los rangos óptimos */}
            <Customized
              component={({ yAxisMap, xAxisMap }) => (
                <OptimalRangeBackground
                  y={i => yAxisMap[0].scale(data[i].name)}
                  height={yAxisMap[0].bandSize}
                  xScale={xAxisMap[0].scale}
                  data={data}
                />
              )}
            />

            {/* Valor actual */}
            <Bar dataKey="value" fill="#8B5CF6" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default NutrientsChart
