import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { useBlogContext } from "@/hooks/useBlogContext"
import toast from "react-hot-toast"
import axiosInstance from "@/services/axiosConfig"

const BlogForm = ({ onClose, mode = "create", initialData = {} }) => {
  const { fetchBlogPostsByPage, currentPage } = useBlogContext()
  const [previewImages, setPreviewImages] = useState([])
  const [existingImages, setExistingImages] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  })

  const watchImages = watch("images")

  // Cargar imágenes actuales si estamos editando
  useEffect(() => {
    if (mode === "edit" && initialData?.images) {
      const existing = [
        initialData.images.thumbnail,
        ...(initialData.images.gallery || []),
      ].filter(Boolean)
      setExistingImages(existing)
    }
  }, [mode, initialData])

  // Previsualizar imágenes nuevas
  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const previews = Array.from(watchImages)
        .filter(file => file instanceof File)
        .map(file => URL.createObjectURL(file))
      setPreviewImages(previews)

      return () => previews.forEach(url => URL.revokeObjectURL(url))
    } else {
      setPreviewImages([])
    }
  }, [watchImages])

  const onSubmit = async data => {
    try {
      // ✅ Validación manual antes de enviar
      if (!data.title || !data.description || !data.content || !data.category) {
        toast.error("Todos los campos obligatorios deben estar completos")
        return
      }

      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("content", data.content)
      formData.append("category", data.category)

      // Agregar imágenes nuevas si hay
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append("images", data.images[i])
        }
      }

      if (mode === "edit") {
        await axiosInstance.patch(`/api/v1/blog/${initialData.slug}`, formData)
        toast.success("Publicación actualizada correctamente")
      } else {
        await axiosInstance.post("/api/v1/blog", formData)
        toast.success("Publicación creada correctamente")
      }

      fetchBlogPostsByPage(currentPage)
      reset()
      onClose?.()
    } catch (error) {
      console.error("Error al enviar el formulario:", error)

      if (error.response) {
        toast.error(
          error.response.data?.error ||
            "Error en el servidor al guardar la publicación"
        )
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
        {/* Título */}
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

        {/* Descripción */}
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

        {/* Contenido */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="content">
            Contenido
          </label>
          <textarea
            {...register("content", { required: "Este campo es requerido" })}
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

        {/* Categoría */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="category">
            Categoría
          </label>
          <select
            {...register("category", { required: "Este campo es requerido" })}
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

        {/* Subida de imágenes */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="images">
            Imágenes (puedes subir varias)
          </label>
          <input
            type="file"
            {...register("images")}
            accept="image/*"
            multiple
            className="text-sm text-white"
          />
        </div>

        {/* Imágenes actuales (modo edición) */}
        {mode === "edit" && existingImages.length > 0 && (
          <div>
            <p className="text-gray-400 text-sm mb-2">Imágenes actuales:</p>
            <div className="grid grid-cols-3 gap-2">
              {existingImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Imagen actual ${idx}`}
                  className="w-full h-24 object-cover rounded-md border border-gray-600"
                />
              ))}
            </div>
          </div>
        )}

        {/* Previsualización de nuevas imágenes */}
        {previewImages.length > 0 && (
          <div>
            <p className="text-gray-400 text-sm mb-2">Nuevas imágenes:</p>
            <div className="grid grid-cols-3 gap-2">
              {previewImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-full h-24 object-cover rounded-md border border-gray-600"
                />
              ))}
            </div>
          </div>
        )}

        {/* Botones */}
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
