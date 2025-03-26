import { motion } from "framer-motion"
import Header from "@/components/common/Header"
import {
  Thermometer,
  Droplet,
  CloudRain,
  Mountain,
  Sun,
  Cloud,
  Calendar,
} from "lucide-react"

const ClimaPage = () => {
  const weather = {
    temperature: 23.5,
    humidity: 68,
    precipitation: 1.2,
    elevation: 1350,
    condition: "Parcialmente nublado",
    season: "Primavera",
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Clima" />

      <motion.div
        className="max-w-3xl mx-auto px-4 lg:px-0 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#2E3D36] border border-[#5F7A6A] rounded-xl p-6 shadow-md text-gray-200">
          <h2 className="text-lg font-medium mb-6 flex items-center gap-2 text-white">
            <Sun className="w-5 h-5 text-yellow-400" />
            Condiciones Climáticas Actuales
          </h2>

          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-red-400" />
              Temperatura:{" "}
              <span className="font-medium text-white">
                {weather.temperature}°C
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Droplet className="w-5 h-5 text-blue-400" />
              Humedad:{" "}
              <span className="font-medium text-white">
                {weather.humidity}%
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CloudRain className="w-5 h-5 text-indigo-400" />
              Precipitación:{" "}
              <span className="font-medium text-white">
                {weather.precipitation} mm/h
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mountain className="w-5 h-5 text-green-400" />
              Altitud:{" "}
              <span className="font-medium text-white">
                {weather.elevation} msnm
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-gray-300" />
              Condición:{" "}
              <span className="font-medium text-white">
                {weather.condition}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-yellow-300" />
              Temporada:{" "}
              <span className="font-medium text-white">{weather.season}</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export default ClimaPage
