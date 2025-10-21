import { motion } from "framer-motion"
import { Leaf, NotebookPen, MountainSnow, CloudRain } from "lucide-react"
import { usePlantContext } from "@/hooks/usePlantContext"

import Header from "@/components/common/Header"
import StatCard from "@/components/common/StatCard"
import SpeciesOverviewChart from "@/components/overview/SpeciesOverviewChart"
import BasicInfo from "@/components/overview/BasicInfo"

const OverviewPage = () => {
  const { totalPlants } = usePlantContext()

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
            name="Total de Especies"
            icon={Leaf}
            value={totalPlants}
            color="#10B981"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpeciesOverviewChart />
          <BasicInfo />
        </div>
      </main>
    </div>
  )
}

export default OverviewPage
