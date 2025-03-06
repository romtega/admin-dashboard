import { motion } from "framer-motion"

const BasicInfo = () => {
  return (
    <motion.div
      className="bg-[#2E3D36] backdrop-blur-md shadow-md rounded-xl p-4 border border-[#5F7A6A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 px-5 py-6 sm:p-5 justify-center h-full items-center gap-4">
        <div className="flex flex-col w-full">
          <span className="text-sm font-light text-gray-300">Lugar:</span>
          <span className="text-lg font-medium text-white">Chiquilistlan</span>
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm font-light text-gray-300">Altitud:</span>
          <span className="text-lg font-medium text-white">1,234 msnm</span>
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm font-light text-gray-300">Temporada:</span>
          <span className="text-lg font-medium text-white">Verano</span>
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm font-light text-gray-300">Año:</span>
          <span className="text-lg font-medium text-white">1</span>
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm font-light text-gray-300">Clima:</span>
          <span className="text-lg font-medium text-white">Soleado</span>
        </div>
        <div className="flex flex-col w-full">
          <span className="text-sm font-light text-gray-300">Fase Lunar:</span>
          <span className="text-lg font-medium text-white">Luna llena</span>
        </div>
      </div>
    </motion.div>
  )
}

export default BasicInfo
