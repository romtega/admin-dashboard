import { motion } from "framer-motion"

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
      className="bg-[#2E3D36] bg-opacity-80 backdrop-blur-md overflow-hidden shadow-md rounded-xl border border-[#5F7A6A]"
      whileHover={{
        y: -5,
        boxShadow: "0 20px 40px -10px rgba(34, 197, 94, 0.3)", // Softer glow effect
      }}
    >
      <div className="px-5 py-6 sm:p-7">
        <span className="flex items-center text-sm font-medium text-[#B3C7BF]">
          <Icon size={20} className="mr-2" style={{ color }} />
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
      </div>
    </motion.div>
  )
}

export default StatCard
