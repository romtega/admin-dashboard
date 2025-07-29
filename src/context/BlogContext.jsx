import { createContext, useState, useEffect } from "react"
import axiosInstance from "@/services/axiosConfig" // Asegúrate de que esta es la instancia correcta de axios
import toast from "react-hot-toast"

const BlogContext = createContext()

const BlogProvider = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPost, setCurrentPost] = useState(null) // Para manejar una publicación específica por slug

  // Función para obtener todas las publicaciones de blog con paginación
  const fetchBlogPostsByPage = async (page = 1) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `/api/v1/blog?page=${page}&limit=8`
      )
      setBlogPosts(response.data.blogPosts) // Suponiendo que el backend devuelve blogPosts
      setTotalPages(response.data.totalPages)
      setCurrentPage(Number(response.data.currentPage))
    } catch (error) {
      console.error("Fetching blog posts failed", error)
      toast.error("No se pudo cargar la lista de publicaciones")
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener una publicación específica por su slug
  const fetchBlogPostBySlug = async slug => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/api/v1/blog/${slug}`)
      setCurrentPost(response.data)
    } catch (error) {
      console.error("Fetching blog post failed", error)
      toast.error("No se pudo cargar la publicación")
    } finally {
      setLoading(false)
    }
  }

  // Función para crear una nueva publicación de blog
  const createBlogPost = async postData => {
    try {
      const response = await axiosInstance.post(`/api/v1/blog`, postData, {
        headers: {
          "Content-Type": "multipart/form-data", // Asegúrate de que este header es correcto
        },
      })
      toast.success("Publicación creada con éxito")
      return response.data
    } catch (error) {
      console.error("Error creating blog post", error)
      toast.error("No se pudo crear la publicación")
    }
  }

  // Función para actualizar una publicación existente
  const updateBlogPost = async (slug, postData) => {
    try {
      const response = await axiosInstance.patch(
        `/api/v1/blog/${slug}`,
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Asegúrate de que este header es correcto
          },
        }
      )
      toast.success("Publicación actualizada con éxito")
      return response.data
    } catch (error) {
      console.error("Error updating blog post", error)
      toast.error("No se pudo actualizar la publicación")
    }
  }

  // Función para eliminar una publicación
  const deleteBlogPost = async slug => {
    try {
      await axiosInstance.delete(`/api/v1/blog/${slug}`)
      toast.success("Publicación eliminada con éxito")
      fetchBlogPostsByPage(currentPage) // Refrescar la lista después de eliminar
    } catch (error) {
      console.error("Error deleting blog post", error)
      toast.error("No se pudo eliminar la publicación")
    }
  }

  useEffect(() => {
    console.log("Fetching blog posts")

    fetchBlogPostsByPage(1) // Cargar las publicaciones al iniciar
  }, [])

  const contextValue = {
    blogPosts,
    loading,
    currentPage,
    totalPages,
    currentPost,
    fetchBlogPostsByPage,
    fetchBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    setCurrentPage,
  }

  return (
    <BlogContext.Provider value={contextValue}>{children}</BlogContext.Provider>
  )
}

export { BlogContext, BlogProvider }
