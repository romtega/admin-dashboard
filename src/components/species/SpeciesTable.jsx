import { motion } from "framer-motion"
import { Edit, Search, Trash2, Plus, Pencil } from "lucide-react"
import { useState } from "react"

const TREE_DATA = [
  {
    id: 1,
    nombre_comun: "Encino Rojo",
    familia: "Fagaceae",
    genero: "Quercus",
    numero: 150,
  },
  {
    id: 2,
    nombre_comun: "Ahuehuete",
    familia: "Cupressaceae",
    genero: "Taxodium",
    numero: 85,
  },
  {
    id: 3,
    nombre_comun: "Pino Blanco",
    familia: "Pinaceae",
    genero: "Pinus",
    numero: 200,
  },
  {
    id: 4,
    nombre_comun: "Ceiba",
    familia: "Malvaceae",
    genero: "Ceiba",
    numero: 90,
  },
  {
    id: 5,
    nombre_comun: "Jacaranda",
    familia: "Bignoniaceae",
    genero: "Jacaranda",
    numero: 140,
  },
  {
    id: 6,
    nombre_comun: "Fresno",
    familia: "Oleaceae",
    genero: "Fraxinus",
    numero: 75,
  },
]

const SpeciesTable = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState(TREE_DATA)

  const handleSearch = e => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = TREE_DATA.filter(
      data =>
        data.nombre_comun.toLowerCase().includes(term) ||
        data.familia.toLowerCase().includes(term) ||
        data.genero.toLowerCase().includes(term)
    )
    setFilteredData(filtered)
  }

  return (
    <motion.div
      className="bg-[#2E3D36] flex flex-col shadow-md rounded-xl border border-[#5F7A6A] p-6 mb-8 sm:max-h-[62vh] max-h-[
      70vh]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white">
          Especies Registradas
        </h2>

        {/* Button & Search Input Container */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="bg-[#5F7A6A] text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all hover:bg-[#4E6658] focus:outline-none focus:ring-2 focus:ring-[#5F7A6A] flex items-center gap-2 cursor-pointer">
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
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-700 ">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Nombre comun
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Familia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Genero
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
            {filteredData.map(specie => (
              <motion.tr
                key={specie.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60"
                    alt="Product img"
                    className="size-10 rounded-full"
                  />
                  {specie.nombre_comun}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {specie.familia}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {specie.genero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {specie.numero}
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
  )
}

export default SpeciesTable
