import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { usePlantContext } from "@/hooks/usePlantContext"
import toast from "react-hot-toast"
import axiosInstance from "@/services/axiosConfig"

const PlantForm = ({ onClose, mode = "create", initialData = {} }) => {
  const { fetchAllPlants } = usePlantContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState({})

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  })

  // Cargar datos en modo edición
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(initialData)
      setImagePreviews(initialData.images || {})
    }
  }, [initialData, mode, reset])

  // Manejo de previsualizaciones de imágenes
  const watchImages = watch(["full", "leaf", "small", "mature"])
  useEffect(() => {
    const previews = {}
    ;["full", "leaf", "small", "mature"].forEach(type => {
      const files = watchImages[type]
      if (files && files.length > 0 && files[0] instanceof File) {
        previews[type] = Array.from(files).map(file =>
          URL.createObjectURL(file)
        )
      } else if (initialData?.images?.[type]?.length) {
        previews[type] = initialData.images[type]
      }
    })
    setImagePreviews(prev => ({ ...prev, ...previews }))
  }, [watchImages, initialData])

  const onSubmit = async data => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("commonName", data.commonName)
      formData.append("family", data.family)
      formData.append("genus", data.genus)
      formData.append("species", data.species)
      formData.append("sunlight", data.sunlight)
      formData.append("fruit", data.fruit)
      if (data.quantity) formData.append("quantity", data.quantity)
      formData.append("isEstablished", !!data.isEstablished) // siempre enviar
      if (data.description) formData.append("description", data.description)

      const imageTypes = ["full", "leaf", "small", "mature"]
      imageTypes.forEach(type => {
        const files = data[type]
        if (files && files.length > 0 && files[0] instanceof File) {
          for (let i = 0; i < files.length; i++) {
            formData.append(type, files[i])
          }
        }
      })

      if (mode === "edit") {
        await axiosInstance.patch(`/api/v1/plants/${initialData._id}`, formData)
        toast.success("Especie actualizada correctamente")
      } else {
        await axiosInstance.post("/api/v1/plants", formData)
        toast.success("Especie creada correctamente")
      }

      fetchAllPlants()
      reset()
      onClose?.()
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      if (error.response) {
        toast.error(error.response.data?.error || "Error en el servidor")
      } else if (error.request) {
        toast.error("No se pudo conectar con el servidor")
      } else {
        toast.error("Error desconocido al enviar el formulario")
      }
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
        {mode === "edit" ? "Editar Especie" : "Nueva Especie"}
      </h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Nombre común */}
        <div className="flex flex-col">
          <label htmlFor="commonName" className="text-sm text-gray-300 mb-1">
            Nombre común
          </label>
          <input
            {...register("commonName", { required: "Este campo es requerido" })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. Guayabo"
            id="commonName"
          />
          {errors.commonName && (
            <span className="text-red-400 text-xs mt-1">
              {errors.commonName.message}
            </span>
          )}
        </div>

        {/* Familia */}
        <div className="flex flex-col">
          <label htmlFor="family" className="text-sm text-gray-300 mb-1">
            Familia
          </label>
          <input
            {...register("family", { required: "Este campo es requerido" })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. Myrtaceae"
            id="family"
          />
          {errors.family && (
            <span className="text-red-400 text-xs mt-1">
              {errors.family.message}
            </span>
          )}
        </div>

        {/* Género */}
        <div className="flex flex-col">
          <label htmlFor="genus" className="text-sm text-gray-300 mb-1">
            Género
          </label>
          <input
            {...register("genus", { required: "Este campo es requerido" })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. Psidium"
            id="genus"
          />
          {errors.genus && (
            <span className="text-red-400 text-xs mt-1">
              {errors.genus.message}
            </span>
          )}
        </div>

        {/* Especie */}
        <div className="flex flex-col">
          <label htmlFor="species" className="text-sm text-gray-300 mb-1">
            Especie
          </label>
          <input
            {...register("species", { required: "Este campo es requerido" })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. guajava"
            id="species"
          />
          {errors.species && (
            <span className="text-red-400 text-xs mt-1">
              {errors.species.message}
            </span>
          )}
        </div>

        {/* Cantidad */}
        <div className="flex flex-col">
          <label htmlFor="quantity" className="text-sm text-gray-300 mb-1">
            Cantidad
          </label>
          <input
            type="number"
            {...register("quantity", { min: 0 })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. 3"
            id="quantity"
          />
          {errors.quantity && (
            <span className="text-red-400 text-xs mt-1">
              {errors.quantity.message}
            </span>
          )}
        </div>

        {/* ¿Establecida? */}
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            {...register("isEstablished")}
            id="isEstablished"
          />
          <label htmlFor="isEstablished" className="text-sm text-gray-300">
            Establecida en campo
          </label>
        </div>

        {/* Exposición solar */}
        <div className="flex flex-col">
          <label htmlFor="sunlight" className="text-sm text-gray-300 mb-1">
            Exposición solar
          </label>
          <select
            {...register("sunlight", { required: "Selecciona una opción" })}
            id="sunlight"
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          >
            <option value="">Selecciona una opción</option>
            <option value="Sol directo">Sol directo</option>
            <option value="Sol indirecto">Sol indirecto</option>
            <option value="Poca luz">Poca luz</option>
          </select>
        </div>

        {/* Tipo de fruto */}
        <div className="flex flex-col">
          <label htmlFor="fruit" className="text-sm text-gray-300 mb-1">
            Tipo de fruto
          </label>
          <select
            {...register("fruit", { required: "Selecciona una opción" })}
            id="fruit"
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          >
            <option value="">Selecciona una opción</option>
            <option value="Comestible">Comestible</option>
            <option value="No comestible">No comestible</option>
          </select>
        </div>

        {/* Descripción */}
        <div className="col-span-full flex flex-col">
          <label htmlFor="description" className="text-sm text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            {...register("description", { maxLength: 500 })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 h-24 resize-none"
            placeholder="Descripción breve..."
            id="description"
          />
        </div>

        {/* Imágenes */}
        <div className="col-span-full">
          <label className="text-sm text-gray-300 mb-2 block">
            Subir imágenes
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["full", "leaf", "small", "mature"].map(type => (
              <div key={type} className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 capitalize">{type}</span>
                {imagePreviews[type]?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {imagePreviews[type].map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`${type}-${idx}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  {...register(type)}
                  accept="image/*"
                  multiple
                  className="text-sm text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="col-span-full mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg text-white ${
              isSubmitting ? "bg-gray-500" : "bg-[#10B981] hover:bg-[#0f9d70]"
            }`}
          >
            {isSubmitting
              ? "Guardando..."
              : mode === "edit"
              ? "Actualizar"
              : "Guardar especie"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default PlantForm
