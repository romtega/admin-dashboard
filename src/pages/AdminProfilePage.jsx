import { motion } from "framer-motion"
import { Pencil, Lock } from "lucide-react"
import Header from "@/components/common/Header"

const AdminProfilePage = () => {
  const admin = {
    name: "Juan Pérez",
    email: "admin@chiquilistlan.mx",
    role: "Administrador",
    avatar: "https://i.pravatar.cc/150?img=3",
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Info Admin" />
      <motion.div
        className="max-w-2xl mx-auto px-4 lg:px-0 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#2E3D36] border border-[#5F7A6A] rounded-xl p-6 shadow-md text-gray-200">
          <div className="flex flex-col items-center gap-4">
            <img
              src={admin.avatar}
              alt={admin.name}
              className="w-24 h-24 rounded-full border-4 border-[#10B981] object-cover"
            />
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold">{admin.name}</h2>
              <p className="text-gray-400 text-sm">{admin.email}</p>
              <span className="text-xs bg-[#10B981] text-black px-3 py-1 rounded-full">
                {admin.role}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombre</label>
              <input
                type="text"
                value={admin.name}
                readOnly
                className="w-full bg-[#1F2937] border border-[#5F7A6A] rounded-md px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={admin.email}
                readOnly
                className="w-full bg-[#1F2937] border border-[#5F7A6A] rounded-md px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value="••••••••"
                readOnly
                className="w-full bg-[#1F2937] border border-[#5F7A6A] rounded-md px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4" />
              Cambiar contraseña
            </button>
            <button className="bg-[#10B981] hover:bg-[#0f9d70] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm">
              <Pencil className="w-4 h-4" />
              Editar información
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminProfilePage
