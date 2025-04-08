// PlantForm.jsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import axiosInstance from "@/services/axiosConfig"
import { usePlantContext } from "@/hooks/usePlantContext"

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
        if (data[type]?.length) {
          for (let i = 0; i < data[type].length; i++) {
            formData.append(type, data[type][i])
          }
        }
      })

      if (mode === "edit") {
        await axiosInstance.patch(`/api/v1/plants/${initialData._id}`, formData)
      } else {
        await axiosInstance.post("/api/v1/plants", formData)
      }

      fetchAllPlants()
      reset()
      onClose?.()
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
    }
  }

  return (
    <motion.div
      className="p-6  w-full"
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
        <div className="flex flex-col">
          <label htmlFor="commonName" className="text-sm text-gray-300 mb-1">
            Nombre común
          </label>
          <input
            id="commonName"
            name="commonName"
            {...register("commonName", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          />
          {errors.commonName && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="family" className="text-sm text-gray-300 mb-1">
            Familia
          </label>
          <input
            id="family"
            name="family"
            {...register("family", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          />
          {errors.family && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="genus" className="text-sm text-gray-300 mb-1">
            Género
          </label>
          <input
            id="genus"
            name="genus"
            {...register("genus", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          />
          {errors.genus && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="species" className="text-sm text-gray-300 mb-1">
            Especie
          </label>
          <input
            id="species"
            name="species"
            {...register("species", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          />
          {errors.species && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="quantity" className="text-sm text-gray-300 mb-1">
            Cantidad
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            {...register("quantity")}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <input
            id="isEstablished"
            name="isEstablished"
            type="checkbox"
            {...register("isEstablished")}
          />
          <label htmlFor="isEstablished" className="text-sm text-gray-300">
            Establecida en campo
          </label>
        </div>

        <div className="col-span-full flex flex-col">
          <label htmlFor="description" className="text-sm text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            {...register("description")}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 h-24 resize-none"
          />
        </div>

        <div className="col-span-full">
          <label className="text-sm text-gray-300 mb-2 block">
            Subir imágenes
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["full", "leaf", "small", "mature"].map(type => (
              <div key={type} className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 capitalize">{type}</span>
                <input
                  id={type}
                  name={type}
                  type="file"
                  multiple
                  accept="image/*"
                  {...register(type)}
                  className="text-sm text-white"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-full mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-gray-500"
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="bg-[#10B981] text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-[#0f9d70]"
          >
            {mode === "edit" ? "Actualizar" : "Guardar especie"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default PlantForm
