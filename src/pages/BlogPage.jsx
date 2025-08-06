import { motion } from "framer-motion"
import { Pencil, Trash2 } from "lucide-react"
import { useBlogContext } from "@/hooks/useBlogContext"
import Header from "@/components/common/Header"
import StatCard from "@/components/common/StatCard"
import BlogTable from "@/components/blog/BlogTable"

const BlogPage = () => {
  const { totalPosts, totalActivePosts, totalCategories, totalDraftPosts } =
    useBlogContext()
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
            value={totalActivePosts}
            icon={Pencil}
            color="#6366F1"
          />
          <StatCard
            name="Borradores"
            value={totalDraftPosts}
            icon={Trash2}
            color="#EF4444"
          />
          <StatCard
            name="Categorías"
            value={totalCategories}
            icon={Pencil}
            color="#F59E0B"
          />
        </motion.div>

        <BlogTable />
      </main>
    </div>
  )
}

export default BlogPage
