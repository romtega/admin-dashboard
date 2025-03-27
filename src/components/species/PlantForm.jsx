import { useForm } from "react-hook-form"
import { motion } from "framer-motion"

import axiosInstance from "@/services/axiosConfig"
import { usePlantContext } from "@/hooks/usePlantContext"

const PlantForm = ({ onClose }) => {
  const { fetchAllPlants } = usePlantContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = async data => {
    try {
      const formData = new FormData()

      // Añadir campos de texto
      formData.append("commonName", data.commonName)
      formData.append("family", data.family)
      formData.append("genus", data.genus)
      formData.append("species", data.species)
      formData.append("sunlight", data.sunlight)
      formData.append("fruit", data.fruit)
      if (data.quantity) formData.append("quantity", data.quantity)
      if (data.isEstablished) formData.append("isEstablished", true)
      if (data.description) formData.append("description", data.description)

      // Añadir imágenes si existen
      const imageTypes = ["full", "leaf", "small", "mature"]
      imageTypes.forEach(type => {
        if (data[type]?.length) {
          for (let i = 0; i < data[type].length; i++) {
            formData.append(type, data[type][i])
          }
        }
      })

      // Enviar al backend
      await axiosInstance.post("/api/v1/plants", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Refrescar la data
      fetchAllPlants()

      // Limpiar formulario y cerrar
      reset()
      onClose?.()
    } catch (error) {
      console.error("Error al enviar la especie:", error)
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium text-white">Nueva Especie</h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Nombre común */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Nombre común</label>
          <input
            {...register("commonName", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. Guayabo"
          />
          {errors.commonName && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        {/* Familia */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Familia</label>
          <input
            {...register("family", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. Myrtaceae"
          />
          {errors.family && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        {/* Género */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Género</label>
          <input
            {...register("genus", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. Psidium"
          />
          {errors.genus && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        {/* Especie */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Especie</label>
          <input
            {...register("species", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. guajava"
          />
          {errors.species && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        {/* Luz solar */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Luz solar</label>
          <select
            {...register("sunlight", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          >
            <option value="">Seleccionar</option>
            <option value="Sol directo">Sol directo</option>
            <option value="Sol indirecto">Sol indirecto</option>
            <option value="Poca luz">Poca luz</option>
          </select>
          {errors.sunlight && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        {/* Fruto */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Fruto</label>
          <select
            {...register("fruit", { required: true })}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          >
            <option value="">Seleccionar</option>
            <option value="Comestible">Comestible</option>
            <option value="No comestible">No comestible</option>
          </select>
          {errors.fruit && (
            <span className="text-red-400 text-xs mt-1">
              Este campo es requerido
            </span>
          )}
        </div>

        {/* Cantidad */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Cantidad</label>
          <input
            type="number"
            {...register("quantity")}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
            placeholder="Ej. 3"
          />
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

        {/* Descripción */}
        <div className="col-span-full flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Descripción</label>
          <textarea
            {...register("description")}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 h-24 resize-none"
            placeholder="Descripción breve de la especie..."
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

        {/* Botón de guardar */}
        {/* Botones de acción */}
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
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlantForm
