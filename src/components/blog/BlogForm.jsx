// src/components/blog/BlogForm.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { useBlogContext } from "@/hooks/useBlogContext"
import toast from "react-hot-toast"
import axiosInstance from "@/services/axiosConfig"

const CATEGORIES = [
  "Diseño",
  "Plantación",
  "Mantenimiento",
  "Otros",
  "Plagas y enfermedades",
  "Recursos",
  "Sostenibilidad",
]

const BlogForm = ({ isOpen, onClose, mode = "create", initialData = {} }) => {
  const { fetchBlogPostsByPage, currentPage, searchTerm } = useBlogContext()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Previews nuevas
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [galleryPreview, setGalleryPreview] = useState([])

  // Existentes (solo en edición)
  const [existingThumbnail, setExistingThumbnail] = useState(null)
  const [existingGallery, setExistingGallery] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      relatedPlants: (initialData?.relatedPlants || []).map(String),
      isActive: initialData?.isActive ?? true,
      thumbnail: undefined, // archivos nuevos
      gallery: undefined, // archivos nuevos
    },
  })

  const watchThumb = watch("thumbnail")
  const watchGallery = watch("gallery")
  const prevOpenRef = useRef(isOpen)

  // Sincroniza datos al cambiar modo/initialData
  useEffect(() => {
    const safeRelated = (initialData?.relatedPlants || []).map(String)
    reset({
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      relatedPlants: safeRelated,
      isActive: initialData?.isActive ?? true,
      thumbnail: undefined,
      gallery: undefined,
    })

    if (mode === "edit" && initialData?.images) {
      setExistingThumbnail(initialData.images.thumbnail || null)
      setExistingGallery(
        Array.isArray(initialData.images.gallery)
          ? initialData.images.gallery
          : []
      )
    } else {
      setExistingThumbnail(null)
      setExistingGallery([])
    }

    // limpiar previews nuevas
    setThumbnailPreview(null)
    setGalleryPreview([])
  }, [mode, initialData, reset])

  // Limpia al cerrar modal
  useEffect(() => {
    if (prevOpenRef.current && !isOpen) {
      reset()
      setExistingThumbnail(null)
      setExistingGallery([])
      setThumbnailPreview(null)
      setGalleryPreview([])
    }
    prevOpenRef.current = isOpen
  }, [isOpen, reset])

  // Preview: thumbnail nuevo
  useEffect(() => {
    if (watchThumb && watchThumb.length > 0) {
      const file = watchThumb[0]
      if (file instanceof File) {
        const url = URL.createObjectURL(file)
        setThumbnailPreview(url)
        return () => URL.revokeObjectURL(url)
      }
    }
    setThumbnailPreview(null)
  }, [watchThumb])

  // Preview: gallery nueva
  useEffect(() => {
    if (watchGallery && watchGallery.length > 0) {
      const files = Array.from(watchGallery).filter(
        f => f instanceof File && f.type.startsWith("image/")
      )
      const urls = files.map(f => URL.createObjectURL(f))
      setGalleryPreview(urls)
      return () => urls.forEach(u => URL.revokeObjectURL(u))
    }
    setGalleryPreview([])
  }, [watchGallery])

  const relatedPlantsList = useMemo(
    () => (initialData?.relatedPlants || []).map(String),
    [initialData?.relatedPlants]
  )

  const onSubmit = async form => {
    if (!form.title || !form.description || !form.content || !form.category) {
      toast.error("Completa título, descripción, contenido y categoría.")
      return
    }

    try {
      setIsSubmitting(true)
      const fd = new FormData()
      fd.append("title", form.title.trim())
      fd.append("description", form.description.trim())
      fd.append("content", form.content.trim())
      fd.append("category", form.category)

      if (typeof form.isActive === "boolean") {
        fd.append("isActive", String(form.isActive))
      }

      if (Array.isArray(form.relatedPlants)) {
        form.relatedPlants.forEach(id => fd.append("relatedPlants", id))
      }

      // Thumbnail (single)
      if (form.thumbnail && form.thumbnail.length > 0) {
        const file = form.thumbnail[0]
        if (!file.type.startsWith("image/")) {
          toast.error(`Archivo no válido: ${file.name}`)
        } else {
          fd.append("thumbnail", file)
        }
      }

      // Gallery (multiple)
      if (form.gallery && form.gallery.length > 0) {
        for (let i = 0; i < form.gallery.length; i++) {
          const f = form.gallery[i]
          if (!f.type.startsWith("image/")) {
            toast.error(`Archivo no válido: ${f.name}`)
            continue
          }
          fd.append("gallery", f)
        }
      }

      if (mode === "edit") {
        await axiosInstance.patch(`/api/v1/blog/${initialData.slug}`, fd)
        toast.success("Publicación actualizada correctamente")
        // Editar: mantener página y búsqueda
        await fetchBlogPostsByPage(currentPage, searchTerm, {
          cancelable: false,
        })
      } else {
        await axiosInstance.post("/api/v1/blog", fd)
        toast.success("Publicación creada correctamente")
        // Crear: volver a página 1, mantener búsqueda
        await fetchBlogPostsByPage(1, searchTerm, { cancelable: false })
      }

      reset()
      onClose?.()
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.errors?.[0] ||
        "Error al guardar la publicación"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
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
            id="title"
            className="bg-gray-700 text-white p-2 rounded-md"
            placeholder="Ej. Preparación de suelo"
            {...register("title", {
              required: "Este campo es requerido",
              maxLength: { value: 120, message: "Máximo 120 caracteres" },
            })}
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
            id="description"
            className="bg-gray-700 text-white p-2 rounded-md"
            placeholder="Descripción breve"
            {...register("description", {
              required: "Este campo es requerido",
              maxLength: { value: 300, message: "Máximo 300 caracteres" },
            })}
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
            id="content"
            className="bg-gray-700 text-white p-2 rounded-md min-h-28"
            placeholder="Contenido de la publicación"
            {...register("content", { required: "Este campo es requerido" })}
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
            id="category"
            className="bg-gray-700 text-white p-2 rounded-md"
            {...register("category", { required: "Este campo es requerido" })}
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-400 text-xs">
              {errors.category.message}
            </span>
          )}
        </div>

        {/* Plantas relacionadas (IDs coma-separados) */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="relatedPlants">
            Plantas relacionadas (IDs, separadas por coma)
          </label>
          <input
            type="text"
            id="relatedPlants"
            className="bg-gray-700 text-white p-2 rounded-md"
            placeholder="6512ab... , 6512cd..."
            onChange={e => {
              const ids = e.target.value
                .split(",")
                .map(s => s.trim())
                .filter(Boolean)
              setValue("relatedPlants", ids, { shouldValidate: true })
            }}
            defaultValue={relatedPlantsList.join(", ")}
          />
          <span className="text-gray-400 text-xs">
            Deja vacío si no aplica.
          </span>
        </div>

        {/* Activa/Inactiva */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" {...register("isActive")} />
          <label htmlFor="isActive" className="text-gray-300">
            Publicación activa
          </label>
        </div>

        {/* Thumbnail (single) */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="thumbnail">
            Thumbnail
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            className="text-sm text-white"
            {...register("thumbnail")}
          />
          {(thumbnailPreview || existingThumbnail) && (
            <div className="mt-2">
              <p className="text-gray-400 text-sm mb-1">Vista previa:</p>
              <img
                src={thumbnailPreview || existingThumbnail}
                alt="thumbnail"
                className="w-32 h-32 object-cover rounded-md border border-gray-600"
              />
            </div>
          )}
        </div>

        {/* Gallery (multiple) */}
        <div className="flex flex-col">
          <label className="text-gray-400" htmlFor="gallery">
            Galería (puedes subir varias)
          </label>
          <input
            type="file"
            id="gallery"
            accept="image/*"
            multiple
            className="text-sm text-white"
            {...register("gallery")}
          />

          {/* Existentes (solo edición) */}
          {mode === "edit" && existingGallery.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-400 text-sm mb-2">Imágenes actuales:</p>
              <div className="grid grid-cols-3 gap-2">
                {existingGallery.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`gallery-${idx}`}
                    className="w-full h-24 object-cover rounded-md border border-gray-600"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Nuevas (previews) */}
          {galleryPreview.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-400 text-sm mb-2">Nuevas imágenes:</p>
              <div className="grid grid-cols-3 gap-2">
                {galleryPreview.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`preview-${idx}`}
                    className="w-full h-24 object-cover rounded-md border border-gray-600"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg text-white ${
              isSubmitting ? "bg-gray-500" : "bg-[#10B981] hover:bg-[#0f9d70]"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Guardando..."
              : mode === "edit"
              ? "Actualizar"
              : "Crear"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default BlogForm
