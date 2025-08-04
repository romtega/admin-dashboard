import { motion } from "framer-motion"
import { Pencil, Trash2 } from "lucide-react"
import { useBlogContext } from "@/hooks/useBlogContext"
import Header from "@/components/common/Header"
import StatCard from "@/components/common/StatCard"
import BlogTable from "@/components/blog/BlogTable"

const BlogPage = () => {
  const { blogPosts } = useBlogContext()

  // Calcular estadísticas dinámicamente
  const totalPosts = blogPosts.length
  const activePosts = blogPosts.filter(post => post.isActive).length
  const postsInDraft = blogPosts.filter(post => !post.isActive).length

  // Obtener las categorías dinámicamente desde las publicaciones
  const postsByCategory = blogPosts.reduce((acc, post) => {
    if (post.category) {
      acc[post.category] = (acc[post.category] || 0) + 1
    }
    return acc
  }, {})

  const categoriesCount = Object.keys(postsByCategory).length // Número de categorías diferentes

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Blog" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 ">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Tarjetas de Estadísticas */}
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
            value={categoriesCount} // Número total de categorías distintas
            icon={Pencil}
            color="#F59E0B"
          />
          <StatCard
            name="Borradores"
            value={postsInDraft}
            icon={Trash2}
            color="#EF4444"
          />
        </motion.div>

        <BlogTable />
      </main>
    </div>
  )
}

export default BlogPage
