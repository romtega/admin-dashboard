import { motion } from "framer-motion"
import { Sprout, CalendarDays } from "lucide-react"

import Header from "@/components/common/Header"
import StatCard from "@/components/common/StatCard"
import SoilStructureChart from "@/components/soil/SoilStructureChart"
import NutrientsChart from "@/components/soil/nutrientschart/NutrientsChart"
import SoilRecommendations from "@/components/soil/SoilRecommendations"

const SoilStructurePage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Estructura del suelo" />
      <p className="text-sm text-dark-400 flex items-center justify-end gap-2 px-4 lg:px-8  ">
        <CalendarDays className="w-4 h-4" />
        Análisis realizado el
        <span className=" font-medium">20 de junio de 2024</span>
      </p>
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Clasificacion del suelo"
            icon={Sprout}
            value="Franco Arcilloso"
            color="#22C55E"
          />
          <StatCard
            name="Materia Organica"
            icon={Sprout}
            value="2.66%"
            color="#22C55E"
          />
          <StatCard
            name="pH del suelo"
            icon={Sprout}
            value="5.18"
            color="#22C55E"
          />
          <StatCard
            name="Conductividad Electrica"
            icon={Sprout}
            value="0.05 mmhos "
            color="#22C55E"
          />
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SoilStructureChart />
          <NutrientsChart />
        </div>
        <SoilRecommendations />
      </main>
    </div>
  )
}

export default SoilStructurePage
