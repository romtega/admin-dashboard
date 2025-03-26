import { motion } from "framer-motion"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useState } from "react"

import Header from "@/components/common/Header"
import ModalForm from "@/components/blog/ModalForm"

const dummyPosts = [
  {
    id: 1,
    title: "Cómo preparar el suelo para temporada de lluvias",
    image: "https://via.placeholder.com/80",
    date: "20/03/2025",
  },
  {
    id: 2,
    title: "Beneficios del compost en cultivos de temporal",
    image: "https://via.placeholder.com/80",
    date: "18/03/2025",
  },
  {
    id: 3,
    title: "Cómo preparar el suelo para temporada de lluvias",
    image: "https://via.placeholder.com/80",
    date: "20/03/2025",
  },
  {
    id: 4,
    title: "Beneficios del compost en cultivos de temporal",
    image: "https://via.placeholder.com/80",
    date: "18/03/2025",
  },
]

const BlogPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editPostData, setEditPostData] = useState(null)

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
        {/* Botón superior */}
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

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl border border-[#5F7A6A] bg-[#2E3D36] shadow-md">
          <table className="min-w-full text-sm text-gray-300">
            <thead className="bg-[#374151] text-left text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-3">Imagen</th>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dummyPosts.map(post => (
                <tr key={post.id} className="border-t border-[#5F7A6A]/30">
                  <td className="px-6 py-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td className="px-6 py-4">{post.date}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default BlogPage
