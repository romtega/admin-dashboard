import { motion } from "framer-motion"
import { FlaskConical, Droplet, AlertTriangle, Info } from "lucide-react"

const SoilRecommendations = () => {
  return (
    <motion.div
      className="bg-[#2E3D36] backdrop-blur-md shadow-md rounded-xl p-6 mt-8 border border-[#5F7A6A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="mb-8 text-lg font-medium text-white flex items-center gap-2">
        Recomendaciones del Suelo
      </h2>
      <ul className="flex flex-col gap-6 text-sm text-gray-300">
        <li className="flex items-center gap-3 leading-snug">
          <FlaskConical className="w-5 h-5 text-[#10B981]" />
          <span>
            Añadir enmiendas ricas en <strong>Nitrógeno</strong> para corregir
            deficiencia (valor actual: 4.15 ppm).
          </span>
        </li>
        <li className="flex items-center gap-3 leading-snug">
          <Droplet className="w-5 h-5 text-[#38BDF8]" />
          <span>
            Aplicar <strong>cal agrícola</strong> para elevar el pH del suelo
            (actual: 5.18).
          </span>
        </li>
        <li className="flex items-center gap-3 leading-snug">
          <Info className="w-5 h-5 text-[#FACC15]" />
          <span>
            Realizar un nuevo análisis en 6 meses para validar efectividad de
            las correcciones.
          </span>
        </li>
        <li className="flex items-center gap-3 leading-snug">
          <AlertTriangle className="w-5 h-5 text-[#F87171]" />
          <span>
            Considerar cultivo de especies adaptadas a suelos ligeramente ácidos
            mientras se corrige.
          </span>
        </li>
      </ul>
    </motion.div>
  )
}

export default SoilRecommendations
