import { motion } from "framer-motion"
import { X } from "lucide-react"

const ModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  initialData = {},
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-[#1F2937] text-gray-200 w-full max-w-lg rounded-xl shadow-lg p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Nueva publicación</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 text-sm">
          <div>
            <label className="block mb-1 text-gray-400">Título</label>
            <input
              type="text"
              name="title"
              defaultValue={initialData.title}
              className="w-full bg-[#2E3D36] border border-[#5F7A6A] rounded-md px-3 py-2 text-white placeholder-gray-500"
              placeholder="Ej. Preparación de suelo"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">Imagen (URL)</label>
            <input
              type="url"
              name="image"
              defaultValue={initialData.image}
              className="w-full bg-[#2E3D36] border border-[#5F7A6A] rounded-md px-3 py-2 text-white placeholder-gray-500"
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">Contenido</label>
            <textarea
              name="content"
              defaultValue={initialData.content}
              rows="4"
              className="w-full bg-[#2E3D36] border border-[#5F7A6A] rounded-md px-3 py-2 text-white placeholder-gray-500"
              placeholder="Escribe aquí el contenido..."
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#10B981] text-white px-4 py-2 rounded-md hover:bg-[#0f9d70]"
            >
              {mode === "edit" ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ModalForm
