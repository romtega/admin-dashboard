import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import PlantForm from "./PlantForm"

const PlantModalForm = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (mode === "create" || initialData) && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-[#2E3D36] rounded-xl border border-[#5F7A6A] p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition cursor-pointer"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            {/* Formulario con props */}
            <PlantForm
              onClose={onClose}
              mode={mode}
              initialData={initialData}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PlantModalForm
