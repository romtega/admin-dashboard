import { motion } from "framer-motion"
import { Trash2, Plus, Edit, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useBlogContext } from "@/hooks/useBlogContext"
import BlogModalForm from "@/components/blog/BlogModalForm"

const getImageUrl = thumbnail => {
  return (
    thumbnail ||
    "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"
  ) // Ruta a imagen por defecto
}

const BlogTable = () => {
  const {
    blogPosts,
    loading,
    fetchBlogPostsByPage,
    currentPage,
    totalPages,
    deleteBlogPost,
  } = useBlogContext()

  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editPostData, setEditPostData] = useState(null)

  const openCreateForm = () => {
    setEditPostData(null)
    setIsModalOpen(true)
  }

  const openEditForm = post => {
    setEditPostData(post)
    setIsModalOpen(true)
  }

  const handleDelete = async slug => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta publicación?"
    )
    if (!confirmDelete) return

    await deleteBlogPost(slug, currentPage, searchTerm) // 🔹 mantiene página y búsqueda
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBlogPostsByPage(1, searchTerm)
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [searchTerm, fetchBlogPostsByPage])

  return (
    <>
      <motion.div
        className="bg-[#2E3D36] flex flex-col shadow-md rounded-xl border border-[#5F7A6A] p-6 mb-8 sm:max-h-[62vh] max-h-[70vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white">Publicaciones</h2>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              className="bg-[#5F7A6A] text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-[#4E6658] flex items-center gap-2"
              onClick={openCreateForm}
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
                placeholder="Buscar publicación..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
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
              ) : blogPosts.length > 0 ? (
                blogPosts.map(post => (
                  <tr key={post._id} className="border-t border-[#5F7A6A]/30">
                    <td className="px-6 py-4">
                      <img
                        src={getImageUrl(post.images?.thumbnail)}
                        alt={post.title}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{post.title}</td>
                    <td className="px-6 py-4">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{post.category}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditForm(post)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No se encontraron publicaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={() =>
                  fetchBlogPostsByPage(currentPage - 1, searchTerm)
                }
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-md bg-gray-700 text-white disabled:opacity-30"
              >
                ← Anterior
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => fetchBlogPostsByPage(page, searchTerm)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === page
                        ? "bg-[#10B981] text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                onClick={() =>
                  fetchBlogPostsByPage(currentPage + 1, searchTerm)
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded-md bg-gray-700 text-white disabled:opacity-30"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <BlogModalForm
        isOpen={isModalOpen && (editPostData || editPostData === null)}
        onClose={() => setIsModalOpen(false)}
        mode={editPostData ? "edit" : "create"}
        initialData={editPostData || {}}
      />
    </>
  )
}

export default BlogTable
