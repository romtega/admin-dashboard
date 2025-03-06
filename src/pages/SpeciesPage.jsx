import { Sprout, TreeDeciduous, Leaf, Trees } from "lucide-react"
import { motion } from "framer-motion"

import Header from "@/components/common/Header"
import StatCard from "@/components/common/StatCard"
import SpeciesTable from "@/components/species/SpeciesTable"

const SpeciesPage = () => {
  return (
    <div className="flex-1 overflow-hidden relative z-10">
      <Header title="Products" />

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
            value={1234}
            color="#10B981"
          />
          <StatCard
            name="Establecidas"
            icon={TreeDeciduous}
            value={89}
            color="#6366F1"
          />
          <StatCard name="Vivero" icon={Sprout} value={23} color="#F59E0B" />
          <StatCard name="SAF" icon={Trees} value="2" color="#EF4444" />
        </motion.div>
        <SpeciesTable />
        <div className="grid grid-col-1 lg:grid-cols-2 gap-8" />
      </main>
    </div>
  )
}

export default SpeciesPage
