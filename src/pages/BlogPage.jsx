import { motion } from "framer-motion"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { useBlogContext } from "@/hooks/useBlogContext"
import Header from "@/components/common/Header"
import StatCard from "@/components/common/StatCard"
import ModalForm from "@/components/blog/ModalForm"

// Dummy categories, replace with actual data later
const categoryEnum = [
  "Diseño",
  "Plantación",
  "Mantenimiento",
  "Otros",
  "Plagas y enfermedades",
  "Recursos",
  "Sostenibilidad",
]

const BlogPage = () => {
  const { blogPosts, loading, fetchBlogPostsByPage } = useBlogContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editPostData, setEditPostData] = useState(null)

  // Dummy statistics
  const totalPosts = blogPosts.length
  const activePosts = blogPosts.filter(post => post.isActive).length
  const postsByCategory = categoryEnum.map(category => ({
    category,
    count: blogPosts.filter(post => post.category === category).length,
  }))
  const postsInDraft = blogPosts.filter(post => !post.isActive).length

  const handleAddPost = e => {
    e.preventDefault()
    const form = e.target
    const newPost = {
      id: Date.now(), // temporal
      title: form.title.value,
      image: form.image.value,
      content: form.content.value,
      date: new Date().toLocaleDateString("es-MX"),
    }
    console.log("Nuevo post:", newPost)
    form.reset()
    setIsModalOpen(false)
  }

  const handleEditPost = e => {
    e.preventDefault()
    const form = e.target
    const updatedPost = {
      ...editPostData,
      title: form.title.value,
      image: form.image.value,
      content: form.content.value,
    }
    console.log("Post actualizado:", updatedPost)
    form.reset()
    setEditPostData(null)
    setIsModalOpen(false)
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Blog" />

      <motion.div
        className="flex flex-col gap-6 px-4 lg:px-8 pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            name="Total de Publicaciones"
            value={totalPosts}
            icon={Pencil}
            color="#10B981"
          />
          <StatCard
            name="Activas"
            value={activePosts}
            icon={Pencil}
            color="#6366F1"
          />
          <StatCard
            name="Categorías"
            value={postsByCategory.length} // Total categories available
            icon={Pencil}
            color="#F59E0B"
          />
          <StatCard
            name="Borradores"
            value={postsInDraft}
            icon={Trash2}
            color="#EF4444"
          />
        </div>

        {/* Botón de creación de nueva publicación */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#10B981] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0f9d70] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva publicación
          </button>

          <ModalForm
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setEditPostData(null)
            }}
            onSubmit={editPostData ? handleEditPost : handleAddPost}
            mode={editPostData ? "edit" : "create"}
            initialData={editPostData || {}}
          />
        </div>

        {/* Tabla de publicaciones */}
        <div className="overflow-x-auto rounded-xl border border-[#5F7A6A] bg-[#2E3D36] shadow-md">
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
                        onClick={() => {
                          setEditPostData(post)
                          setIsModalOpen(true)
                        }}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-400">
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
    </div>
  )
}

export default BlogPage
