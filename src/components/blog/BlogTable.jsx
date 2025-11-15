import { motion } from "framer-motion"
import { Trash2, Plus, Edit, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useBlogContext } from "@/hooks/useBlogContext"
import BlogModalForm from "@/components/blog/BlogModalForm"
import { useAuthContext } from "@/hooks/useAuthContext"

const getImageUrl = images => {
  if (
    typeof images?.thumbnail === "string" &&
    images.thumbnail.startsWith("http")
  ) {
    return images.thumbnail
  }
  if (Array.isArray(images?.gallery) && images.gallery.length > 0) {
    const first = images.gallery.find(
      u => typeof u === "string" && u.startsWith("http")
    )
    if (first) return first
  }
  // LEGADO: si algún doc viejo aún trae images como array:
  if (
    Array.isArray(images) &&
    images.length > 0 &&
    typeof images[0] === "string"
  ) {
    return images[0]
  }
  return "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"
}

const DEBOUNCE_MS = 300

const BlogTable = () => {
  const {
    blogPosts,
    loading,
    fetchBlogPostsByPage,
    currentPage,
    totalPages,
    deleteBlogPost,
    searchTerm,
    setSearchTerm,
  } = useBlogContext()
  const { user } = useAuthContext()
  const isAdmin = user?.role === "admin"

  const [localSearch, setLocalSearch] = useState(searchTerm)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editPostData, setEditPostData] = useState(null)

  // Mantén el input sincronizado si cambia el search global (navegación, etc.)
  useEffect(() => {
    setLocalSearch(searchTerm)
  }, [searchTerm])

  // Debounce de búsqueda → página 1, cancelable
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchTerm(localSearch)
      fetchBlogPostsByPage(1, localSearch, { cancelable: true })
    }, DEBOUNCE_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch])

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
    await deleteBlogPost(slug) // mantiene página y búsqueda; retrocede si la página quedó vacía
  }

  const goPage = page => {
    if (page < 1 || page > totalPages || page === currentPage) return
    fetchBlogPostsByPage(page, searchTerm, { cancelable: true })
  }

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
            {isAdmin && (
              <button
                className="bg-[#5F7A6A] text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-[#4E6658] flex items-center gap-2"
                onClick={openCreateForm}
              >
                <Plus size={18} /> Agregar
              </button>
            )}

            <div className="relative w-full sm:w-[250px]">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar publicación..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
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
                {isAdmin && <th className="px-6 py-3 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Cargando...
                  </td>
                </tr>
              ) : blogPosts.length > 0 ? (
                blogPosts.map(post => (
                  <tr key={post._id} className="border-t border-[#5F7A6A]/30">
                    <td className="px-6 py-4">
                      <img
                        src={getImageUrl(post.images)}
                        alt={post.title}
                        className="w-16 h-16 rounded-md object-cover"
                        loading="lazy"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{post.title}</td>
                    <td className="px-6 py-4">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{post.category}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {isAdmin && (
                        <>
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
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
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
                type="button"
                onClick={() => goPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-md bg-gray-700 text-white disabled:opacity-30"
              >
                ← Anterior
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                const isActive = currentPage === page
                return (
                  <button
                    type="button"
                    key={page}
                    onClick={() => goPage(page)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      isActive
                        ? "bg-[#10B981] text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {page}
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => goPage(currentPage + 1)}
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
