import { createContext, useState, useEffect, useCallback } from "react"
import axiosInstance from "@/services/axiosConfig"
import toast from "react-hot-toast"

const BlogContext = createContext()

const BlogProvider = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totals, setTotals] = useState({
    totalPosts: 0,
    totalActivePosts: 0,
    totalDraftPosts: 0,
    totalCategories: 0,
  })

  const handleError = (message, error) => {
    console.error(message, error)
    toast.error(message)
  }

  const fetchBlogPostsByPage = useCallback(
    async (page = 1, searchTerm = "") => {
      setLoading(true)
      try {
        const { data } = await axiosInstance.get(
          `/api/v1/blog?page=${page}&limit=8&search=${encodeURIComponent(
            searchTerm
          )}`
        )

        setBlogPosts(data.blogPosts)
        setTotals({
          totalPosts: data.totalPosts,
          totalActivePosts: data.totalActivePosts,
          totalDraftPosts: data.totalDraftPosts,
          totalCategories: data.totalCategories,
        })
        setTotalPages(data.totalPages)
        setCurrentPage(Number(data.currentPage))
      } catch (error) {
        handleError("No se pudo cargar la lista de publicaciones", error)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteBlogPost = useCallback(
    async (slug, page = currentPage, searchTerm = "") => {
      try {
        await axiosInstance.delete(`/api/v1/blog/${slug}`)
        toast.success("Publicación eliminada con éxito")
        fetchBlogPostsByPage(page, searchTerm)
      } catch (error) {
        handleError("No se pudo eliminar la publicación", error)
      }
    },
    [fetchBlogPostsByPage, currentPage]
  )

  useEffect(() => {
    fetchBlogPostsByPage(1)
  }, [fetchBlogPostsByPage])

  const contextValue = {
    blogPosts,
    ...totals, // totalPosts, totalActivePosts, totalDraftPosts, totalCategories
    loading,
    currentPage,
    totalPages,
    fetchBlogPostsByPage,
    deleteBlogPost,
    setCurrentPage,
  }

  return (
    <BlogContext.Provider value={contextValue}>{children}</BlogContext.Provider>
  )
}

export { BlogContext, BlogProvider }
