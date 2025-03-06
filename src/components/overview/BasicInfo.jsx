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
    value: "Chiquilistlan",
  },
  {
    icon: ArrowUpCircle,
    color: "text-indigo-500",
    value: "1,234 msnm",
  },
  {
    icon: Sun,
    color: "text-yellow-500",
    value: "Verano",
  },
  {
    icon: Calendar,
    color: "text-orange-500",
    value: "1",
  },
  {
    icon: CloudSun,
    color: "text-red-500",
    value: "Soleado",
  },
  {
    icon: Moon,
    color: "text-purple-500",
    value: "Luna llena",
  },
]

const BasicInfo = () => {
  return (
    <motion.div
      className="bg-[#2E3D36] backdrop-blur-md shadow-md rounded-xl p-4 border border-[#5F7A6A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 px-5 py-6 sm:p-5 justify-center h-full items-center gap-4">
        {BASIC_INFO.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 w-full">
            <div className={`p-2 rounded-full ${item.color} bg-opacity-20`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <span className="text-lg font-medium text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BasicInfo
