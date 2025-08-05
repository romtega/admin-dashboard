import { Sprout, TreeDeciduous, Leaf, Trees } from "lucide-react"
import { motion } from "framer-motion"
import { usePlantContext } from "@/hooks/usePlantContext"

import Header from "@/components/common/Header"
import StatCard from "@/components/common/StatCard"
import SpeciesTable from "@/components/species/SpeciesTable"
import SpeciesFamiliesChart from "@/components/species/SpeciesFamiliesChart"
import SpeciesOverviewChart from "@/components/overview/SpeciesOverviewChart"

const SpeciesPage = () => {
  const { totalPlants, totalEstablished, totalNursery } = usePlantContext()

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Especies" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 ">
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
            name="Establecidas"
            icon={TreeDeciduous}
            value={totalEstablished}
            color="#6366F1"
          />
          <StatCard
            name="Vivero"
            icon={Sprout}
            value={totalNursery}
            color="#F59E0B"
          />
          <StatCard name="SAF" icon={Trees} value={2} color="#EF4444" />{" "}
        </motion.div>

        <SpeciesTable />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpeciesFamiliesChart />
          <SpeciesOverviewChart />
        </div>
      </main>
    </div>
  )
}

export default SpeciesPage
