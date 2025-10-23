import { createContext, useState, useEffect, useCallback, useRef } from "react"
import axiosInstance from "@/services/axiosConfig"
import toast from "react-hot-toast"

const BlogContext = createContext()

const BlogProvider = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("") // ← búsqueda global
  const [totals, setTotals] = useState({
    totalPosts: 0,
    totalActivePosts: 0,
    totalDraftPosts: 0,
    totalCategories: 0,
  })

  // Guardamos el AbortController y si la petición es cancelable
  const reqRef = useRef({ controller: null, cancelable: true })

  const handleError = (message, error) => {
    const wasCanceled =
      error?.name === "CanceledError" || error?.code === "ERR_CANCELED"
    if (!wasCanceled) {
      console.error(message, error)
      toast.error(message)
    }
  }

  /**
   * fetchBlogPostsByPage
   * - cancelable=true: se permite abortar por nuevas búsquedas/paginaciones
   * - cancelable=false: llamadas de CRUD (no abortar)
   */
  const fetchBlogPostsByPage = useCallback(
    async (page = 1, q = searchTerm, opts = { cancelable: true }) => {
      const cancelable = opts?.cancelable !== false

      // Si hay una petición en curso y ERA cancelable, la abortamos.
      if (reqRef.current.controller && reqRef.current.cancelable) {
        reqRef.current.controller.abort()
      }
      const controller = new AbortController()
      reqRef.current = { controller, cancelable }

      setLoading(true)
      try {
        const encoded = encodeURIComponent(q || "")
        const { data } = await axiosInstance.get(
          `/api/v1/blog?page=${Number(page)}&limit=8&search=${encoded}`,
          { signal: controller.signal }
        )

        setBlogPosts(data.blogPosts || [])
        setTotals({
          totalPosts: data.totalPosts ?? 0,
          totalActivePosts: data.totalActivePosts ?? 0,
          totalDraftPosts: data.totalDraftPosts ?? 0,
          totalCategories: data.totalCategories ?? 0,
        })
        setTotalPages(Number(data.totalPages ?? 1))
        setCurrentPage(Number(data.currentPage ?? page))
        // guarda el término activo en el contexto
        setSearchTerm(q || "")
      } catch (error) {
        handleError("No se pudo cargar la lista de publicaciones", error)
      } finally {
        // Solo si este controller sigue siendo el actual, limpiamos y apagamos loading
        if (reqRef.current.controller === controller) {
          reqRef.current = { controller: null, cancelable: true }
          setLoading(false)
        }
      }
    },
    [searchTerm]
  )

  const deleteBlogPost = useCallback(
    async slug => {
      try {
        await axiosInstance.delete(`/api/v1/blog/${slug}`)
        toast.success("Publicación eliminada con éxito")

        // Si borramos el último item de la página (y no estamos en la 1), retrocedemos página
        const isLastItemOnPage = blogPosts.length === 1
        const nextPage =
          isLastItemOnPage && currentPage > 1 ? currentPage - 1 : currentPage

        await fetchBlogPostsByPage(nextPage, searchTerm, { cancelable: false })
      } catch (error) {
        handleError("No se pudo eliminar la publicación", error)
      }
    },
    [blogPosts.length, currentPage, searchTerm, fetchBlogPostsByPage]
  )

  useEffect(() => {
    fetchBlogPostsByPage(1, "", { cancelable: true })
    return () => {
      if (reqRef.current.controller) reqRef.current.controller.abort()
    }
  }, [fetchBlogPostsByPage])

  const contextValue = {
    blogPosts,
    ...totals,
    loading,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm, // para controlar el input de búsqueda desde la tabla
    fetchBlogPostsByPage,
    deleteBlogPost,
    setCurrentPage,
  }

  return (
    <BlogContext.Provider value={contextValue}>{children}</BlogContext.Provider>
  )
}

export { BlogContext, BlogProvider }
