import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { useBlogContext } from "@/hooks/useBlogContext"
import toast from "react-hot-toast"
import axiosInstance from "@/services/axiosConfig"

const BlogForm = ({ onClose, mode = "create", initialData = {} }) => {
  const { fetchBlogPostsByPage } = useBlogContext()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  })

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(initialData)
    }
  }, [initialData, mode, reset])

  // Handle form submission
  const onSubmit = async data => {
    try {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("content", data.content)
      formData.append("category", data.category) // Añadimos la categoría

      // If image is uploaded, append it to the formData
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0])
      }

      // Create or update post
      if (mode === "edit") {
        await axiosInstance.patch(`/api/v1/blog/${initialData.slug}`, formData)
        toast.success("Publicación actualizada correctamente")
      } else {
        await axiosInstance.post("/api/v1/blog", formData)
        toast.success("Publicación creada correctamente")
      }

      fetchBlogPostsByPage() // Recargar la lista de publicaciones
      reset() // Limpiar el formulario
      onClose?.() // Cerrar el modal
    } catch (error) {
      console.error("Error al enviar el formulario:", error)

      if (error.response) {
        const serverMessage =
          error.response.data?.error ||
          "Error en el servidor al guardar la publicación"
        toast.error(serverMessage)
      } else if (error.request) {
        toast.error("No se pudo conectar con el servidor")
      } else {
        toast.error("Error desconocido al enviar el formulario")
      }
    }
  }

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="mb-6 text-lg font-medium text-white">
        {mode === "edit" ? "Editar Publicación" : "Nueva Publicación"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="title">
            Título
          </label>
          <input
            type="text"
            {...register("title", { required: "Este campo es requerido" })}
            id="title"
            className="bg-gray-700 text-white p-2 rounded-md"
            placeholder="Ej. Preparación de suelo"
          />
          {errors.title && (
            <span className="text-red-400 text-xs">{errors.title.message}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="description">
            Descripción
          </label>
          <textarea
            {...register("description", {
              required: "Este campo es requerido",
            })}
            id="description"
            className="bg-gray-700 text-white p-2 rounded-md"
            placeholder="Descripción breve"
          />
          {errors.description && (
            <span className="text-red-400 text-xs">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="content">
            Contenido
          </label>
          <textarea
            {...register("content", {
              required: "Este campo es requerido",
            })}
            id="content"
            className="bg-gray-700 text-white p-2 rounded-md"
            placeholder="Contenido de la publicación"
          />
          {errors.content && (
            <span className="text-red-400 text-xs">
              {errors.content.message}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="category">
            Categoría
          </label>
          <select
            {...register("category", {
              required: "Este campo es requerido",
            })}
            id="category"
            className="bg-gray-700 text-white p-2 rounded-md"
          >
            <option value="">Selecciona una categoría</option>
            <option value="Diseño">Diseño</option>
            <option value="Plantación">Plantación</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Otros">Otros</option>
            <option value="Plagas y enfermedades">Plagas y enfermedades</option>
            <option value="Recursos">Recursos</option>
            <option value="Sostenibilidad">Sostenibilidad</option>
          </select>
          {errors.category && (
            <span className="text-red-400 text-xs">
              {errors.category.message}
            </span>
          )}
        </div>

        {/* Image */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="image">
            Imagen
          </label>
          <input
            type="file"
            {...register("image")}
            accept="image/*"
            className="text-sm text-white"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#10B981] text-white px-6 py-2 rounded-lg"
          >
            {mode === "edit" ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default BlogForm
