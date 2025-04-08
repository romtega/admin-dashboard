import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { usePlantContext } from "@/hooks/usePlantContext"
import toast from "react-hot-toast"
import axiosInstance from "@/services/axiosConfig"

const PlantForm = ({ onClose, mode = "create", initialData = {} }) => {
  const { fetchAllPlants } = usePlantContext()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  })

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(initialData)
    }
  }, [initialData, mode, reset])

  const onSubmit = async data => {
    try {
      const formData = new FormData()
      formData.append("commonName", data.commonName)
      formData.append("family", data.family)
      formData.append("genus", data.genus)
      formData.append("species", data.species)
      formData.append("sunlight", data.sunlight)
      formData.append("fruit", data.fruit)
      if (data.quantity) formData.append("quantity", data.quantity)
      if (data.isEstablished) formData.append("isEstablished", true)
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

      for (const pair of formData.entries()) {
        console.log(`[FormData] ${pair[0]}:`, pair[1])
      }

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
        // Error enviado por el servidor (status 400, 500, etc.)
        const serverMessage =
          error.response.data?.error ||
          "Error en el servidor al guardar la especie"
        toast.error(serverMessage)
        // console.error("💥 DATA desde backend:", error.response.data)
        // const mensajes = error.response.data?.errors || [
        //   error.response.data?.error,
        // ]
        // mensajes.forEach(msg => toast.error(msg))
      } else if (error.request) {
        // No hubo respuesta del servidor
        toast.error("No se pudo conectar con el servidor")
      } else {
        // Error inesperado
        toast.error("Error desconocido al enviar el formulario")
      }
    }
  }

  return (
    <motion.div
      className=" p-6"
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
          <label className="text-sm text-gray-300 mb-1" htmlFor="commonName">
            Nombre común
          </label>
          <input
            {...register("commonName", {
              required: "Este campo es requerido",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
              maxLength: { value: 50, message: "Máximo 50 caracteres" },
            })}
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
          <label className="text-sm text-gray-300 mb-1" htmlFor="family">
            Familia
          </label>
          <input
            {...register("family", {
              required: "Este campo es requerido",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
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
          <label className="text-sm text-gray-300 mb-1" htmlFor="genus">
            Género
          </label>
          <input
            {...register("genus", {
              required: "Este campo es requerido",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
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
          <label className="text-sm text-gray-300 mb-1" htmlFor="species">
            Especie
          </label>
          <input
            {...register("species", {
              required: "Este campo es requerido",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
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
          <label className="text-sm text-gray-300 mb-1" htmlFor="quantity">
            Cantidad
          </label>
          <input
            type="number"
            {...register("quantity", {
              min: { value: 0, message: "La cantidad no puede ser negativa" },
            })}
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
          {errors.sunlight && (
            <span className="text-red-400 text-xs mt-1">
              {errors.sunlight.message}
            </span>
          )}
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
          {errors.fruit && (
            <span className="text-red-400 text-xs mt-1">
              {errors.fruit.message}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div className="col-span-full flex flex-col">
          <label className="text-sm text-gray-300 mb-1" htmlFor="description">
            Descripción
          </label>
          <textarea
            {...register("description", {
              maxLength: { value: 500, message: "Máximo 500 caracteres" },
            })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 h-24 resize-none"
            placeholder="Descripción breve de la especie..."
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
            className="bg-gray-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-gray-500 transition-all"
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="bg-[#10B981] text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-[#0f9d70] transition-all"
          >
            {mode === "edit" ? "Actualizar" : "Guardar especie"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default PlantForm
