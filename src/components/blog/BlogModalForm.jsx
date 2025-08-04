import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import BlogForm from "./BlogForm"

const BlogModalForm = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (mode === "create" || initialData) && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#2E3D36] rounded-xl p-6 relative w-full max-w-2xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            {/* Formulario con props */}
            <BlogForm onClose={onClose} mode={mode} initialData={initialData} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BlogModalForm
