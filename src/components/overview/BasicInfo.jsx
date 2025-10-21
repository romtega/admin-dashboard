import { motion } from "framer-motion"
import {
  MapPin,
  ArrowUpCircle,
  Sun,
  Calendar,
  CloudSun,
  Moon,
} from "lucide-react"

const BASIC_INFO = [
  {
    icon: MapPin,
    color: "text-teal-500",
    label: "Ubicación",
    value: "Chiquilistlan",
  },
  {
    icon: ArrowUpCircle,
    color: "text-indigo-500",
    label: "Altura",

    value: "1,750",
  },
  {
    icon: Sun,
    color: "text-yellow-500",
    label: "Temporada",

    value: "Verano",
  },
  {
    icon: Calendar,
    color: "text-orange-500",
    label: "Año",

    value: "2",
  },
  {
    icon: CloudSun,
    color: "text-red-500",
    label: "Clima",
    value: "Soleado",
  },
  {
    icon: Moon,
    color: "text-purple-500",
    label: "Fase lunar",
    value: "Luna llena",
  },
]

const BasicInfo = () => {
  return (
    <motion.div
      className="bg-[#2E3D36] backdrop-blur-md shadow-md rounded-xl p-2 border border-[#5F7A6A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-5 py-6 sm:p-5 h-full">
        {BASIC_INFO.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full h-full bg-white/5 rounded-lg p-4"
          >
            {/* Fila con icono + label */}
            <div className="flex items-center gap-1 mb-2">
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full ${item.color} bg-opacity-20`}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="text-sm text-white/70 font-medium">
                {item.label ?? "Etiqueta"}
              </span>
            </div>

            {/* Valor centrado */}
            <span className="text-2xl font-semibold text-white text-center">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BasicInfo
