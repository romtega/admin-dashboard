import { motion } from "framer-motion"
import { Sprout, NotebookPen, MountainSnow, CloudRain } from "lucide-react"

import Header from "@/components/common/Header"
import StatCard from "@/components/common/StatCard"

const OverviewPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="General" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="No. de Especies"
            icon={Sprout}
            value="123"
            color="#22C55E"
          />
          <StatCard
            name="No. de Publicaciones"
            icon={NotebookPen}
            value="15"
            color="#06B6D4"
          />
          <StatCard
            name="Calidad de suelo"
            icon={MountainSnow}
            value="Bueno"
            color="#D97706"
          />
          <StatCard
            name="Clima"
            icon={CloudRain}
            value="12.5°"
            color="#3B82F6"
          />
        </motion.div>
      </main>
    </div>
  )
}

export default OverviewPage
