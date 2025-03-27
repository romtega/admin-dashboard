import { motion } from "framer-motion"
import { Edit, Search, Trash2, Plus, Pencil, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePlantContext } from "@/hooks/usePlantContext"
import PlantModalForm from "@/components/species/PlantModalForm"

const SpeciesTable = () => {
  const [showForm, setShowForm] = useState(false)
  const { plantsData } = usePlantContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = plantsData.filter(
      plant =>
        plant.commonName?.toLowerCase().includes(term) ||
        plant.family?.toLowerCase().includes(term) ||
        plant.genus?.toLowerCase().includes(term)
    )
    setFilteredData(filtered)
  }, [searchTerm, plantsData])

  const getImageUrl = imageArray => imageArray?.[0] || "fallbackImg"

  return (
    <>
      <motion.div
        className="bg-[#2E3D36] flex flex-col shadow-md rounded-xl border border-[#5F7A6A] p-6 mb-8 sm:max-h-[62vh] max-h-[70vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white">
            Especies Registradas
          </h2>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              className="bg-[#5F7A6A] text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all hover:bg-[#4E6658] focus:outline-none focus:ring-2 focus:ring-[#5F7A6A] flex items-center gap-2 cursor-pointer"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} /> Agregar
            </button>

            <div className="relative w-full sm:w-[250px]">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar especie..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:bg-[#4E6658]"
                onChange={e => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nombre común
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Familia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <Pencil size={18} />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredData.map(plant => (
                <motion.tr
                  key={plant._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                    <img
                      src={getImageUrl(plant.images?.full)}
                      alt={plant.commonName}
                      className="size-10 rounded-full object-cover"
                    />
                    {plant.commonName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {plant.family}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {plant.genus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {plant.quantity ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button className="text-[#F59E0B] hover:text-indigo-300 mr-2 cursor-pointer">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-400 hover:text-red-300 cursor-pointer">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <PlantModalForm isOpen={showForm} onClose={() => setShowForm(false)} />
    </>
  )
}

export default SpeciesTable
