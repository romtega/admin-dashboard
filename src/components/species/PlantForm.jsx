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

  // 👁️‍🗨️ Watch individual de cada input de imagen
  const watchFull = watch("full")
  const watchLeaf = watch("leaf")
  const watchSmall = watch("small")
  const watchMature = watch("mature")

  // Cargar datos en modo edición
  useEffect(() => {
    if (mode === "edit" && initialData?.images) {
      setImagePreviews(initialData.images)
      reset(initialData)
    }
  }, [initialData, mode, reset])

  // Actualizar previsualización cuando se seleccionan imágenes nuevas
  useEffect(() => {
    const previews = {}
    const imageTypes = [
      { type: "full", files: watchFull },
      { type: "leaf", files: watchLeaf },
      { type: "small", files: watchSmall },
      { type: "mature", files: watchMature },
    ]

    imageTypes.forEach(({ type, files }) => {
      if (files && files.length > 0 && files[0] instanceof File) {
        previews[type] = Array.from(files).map(file =>
          URL.createObjectURL(file)
        )
      }
    })

    if (Object.keys(previews).length > 0) {
      setImagePreviews(prev => ({ ...prev, ...previews }))
    }

    return () => {
      Object.values(previews)
        .flat()
        .forEach(url => URL.revokeObjectURL(url))
    }
  }, [watchFull, watchLeaf, watchSmall, watchMature])

  // Envío del formulario
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
      formData.append("isEstablished", !!data.isEstablished)
      if (data.quantity) formData.append("quantity", data.quantity)
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
        {/* Campos de texto */}
        {[
          {
            id: "commonName",
            label: "Nombre común",
            placeholder: "Ej. Guayabo",
          },
          { id: "family", label: "Familia", placeholder: "Ej. Myrtaceae" },
          { id: "genus", label: "Género", placeholder: "Ej. Psidium" },
          { id: "species", label: "Especie", placeholder: "Ej. guajava" },
        ].map(({ id, label, placeholder }) => (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="text-sm text-gray-300 mb-1">
              {label}
            </label>
            <input
              {...register(id, { required: "Este campo es requerido" })}
              className="bg-gray-700 text-white rounded-lg px-3 py-2"
              placeholder={placeholder}
              id={id}
            />
            {errors[id] && (
              <span className="text-red-400 text-xs mt-1">
                {errors[id].message}
              </span>
            )}
          </div>
        ))}

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

        {/* Establecida */}
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
            {...register("description", {
              required: "La descripción es obligatoria",
              maxLength: 500,
            })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 h-24 resize-none"
            placeholder="Descripción breve..."
            id="description"
          />
          {errors.description && (
            <span className="text-red-400 text-xs mt-1">
              {errors.description.message}
            </span>
          )}
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
