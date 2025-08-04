import { motion } from "framer-motion"
import { Trash2, Plus, Edit } from "lucide-react"
import { useState } from "react"
import { useBlogContext } from "@/hooks/useBlogContext"
import axiosInstance from "@/services/axiosConfig"
import toast from "react-hot-toast"
import BlogModalForm from "@/components/blog/BlogModalForm"

const BlogTable = () => {
  const { blogPosts, loading, fetchBlogPostsByPage, currentPage } =
    useBlogContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editPostData, setEditPostData] = useState(null)

  // Abrir formulario para crear una nueva publicación
  const openCreateForm = () => {
    setEditPostData(null)
    setIsModalOpen(true)
  }

  // Abrir formulario para editar una publicación
  const openEditForm = post => {
    setEditPostData(post)
    setIsModalOpen(true)
  }

  // Función para eliminar una publicación
  const handleDelete = async slug => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas eliminar esta publicación?"
    )
    if (!confirm) return

    try {
      await axiosInstance.delete(`/api/v1/blog/${slug}`)
      toast.success("Publicación eliminada correctamente")
      fetchBlogPostsByPage(currentPage) // Actualizar la lista de publicaciones
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast.error("Error al eliminar la publicación")
    }
  }

  return (
    <>
      <motion.div
        className="bg-[#2E3D36] flex flex-col shadow-md rounded-xl border border-[#5F7A6A] p-6 mb-8 sm:max-h-[62vh] max-h-[70vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Botón para crear una nueva publicación */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white">Publicaciones </h2>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              className="bg-[#5F7A6A] text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-[#4E6658] flex items-center gap-2"
              onClick={openCreateForm}
            >
              <Plus size={18} /> Agregar
            </button>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-[#374151] text-left text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-3">Imagen</th>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Cargando...
                  </td>
                </tr>
              ) : (
                blogPosts.map(post => (
                  <tr key={post._id} className="border-t border-[#5F7A6A]/30">
                    <td className="px-6 py-4">
                      <img
                        src={post.images.thumbnail}
                        alt={post.title}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{post.title}</td>
                    <td className="px-6 py-4">{post.date}</td>
                    <td className="px-6 py-4">{post.category}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditForm(post)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de creación o edición de publicaciones */}
      <BlogModalForm
        isOpen={isModalOpen && (editPostData || editPostData === null)} // Condición para abrir el modal
        onClose={() => setIsModalOpen(false)} // Cerrar el modal
        mode={editPostData ? "edit" : "create"} // Modo de operación
        initialData={editPostData || {}} // Datos iniciales (en caso de edición)
      />
    </>
  )
}

export default BlogTable
