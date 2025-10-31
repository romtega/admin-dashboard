import { useEffect, useState } from "react"
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
import axiosInstance from "@/services/axiosConfig"

const ClimaPage = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/api/v1/weather?lat=20.2000&lon=-103.8167"
        )
        setWeather(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header SIEMPRE visible */}
      <Header title="Clima" />

      <motion.div
        className="max-w-2xl mx-auto px-6 py-10 flex flex-col items-center justify-center min-h-[80vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#2E3D36]/90 border border-[#5F7A6A] rounded-2xl p-8 shadow-lg text-gray-200 w-full backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 text-white justify-center">
            <Sun className="w-6 h-6 text-yellow-400" />
            Condiciones Climáticas Actuales
          </h2>

          {/* SOLO el bloque cambia entre skeleton y contenido */}
          {loading ? (
            <ul className="space-y-5">
              {[...Array(6)].map((_, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-600/60" />
                  <div className="h-5 w-48 bg-gray-600/60 rounded-md" />
                </li>
              ))}
            </ul>
          ) : weather ? (
            <ul className="space-y-5 text-base md:text-lg">
              <li className="flex items-center gap-3">
                <Thermometer className="w-6 h-6 text-red-400" />
                Temperatura:
                <span className="font-semibold text-white ml-2">
                  {Number(weather.temperature).toFixed(1)}°C
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Droplet className="w-6 h-6 text-blue-400" />
                Humedad:
                <span className="font-semibold text-white ml-2">
                  {weather.humidity}%
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CloudRain className="w-6 h-6 text-indigo-400" />
                Precipitación:
                <span className="font-semibold text-white ml-2">
                  {weather.precipitation} mm/h
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mountain className="w-6 h-6 text-green-400" />
                Altitud:
                <span className="font-semibold text-white ml-2">
                  {weather.elevation ?? "—"} msnm
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Cloud className="w-6 h-6 text-gray-300" />
                Condición:
                <span className="font-semibold text-white ml-2">
                  {weather.condition}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-yellow-300" />
                Temporada:
                <span className="font-semibold text-white ml-2">
                  {weather.season}
                </span>
              </li>
            </ul>
          ) : (
            <p className="text-red-300 text-sm">
              No se pudo cargar la información del clima.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ClimaPage
