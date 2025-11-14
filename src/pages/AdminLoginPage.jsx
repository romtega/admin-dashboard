import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "@/hooks/useAuthContext"
import Header from "@/components/common/Header"

const AdminLoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { user, loadingUser, login } = useAuthContext()
  const navigate = useNavigate()

  // Si ya está logueado, mandarlo al /admin
  useEffect(() => {
    if (!loadingUser && user) {
      navigate("/admin", { replace: true })
    }
  }, [loadingUser, user, navigate])

  const onSubmit = async data => {
    const { email, password } = data
    const result = await login({ email, password })
    if (result.ok) {
      navigate("/admin", { replace: true })
    }
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Login Admin" />

      <motion.div
        className="max-w-md mx-auto px-4 py-10 flex items-center justify-center min-h-[70vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full bg-[#2E3D36] border border-[#5F7A6A] rounded-xl p-6 shadow-md text-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-lg font-semibold text-white">
              Iniciar sesión como administrador
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="bg-[#1F2937] border border-[#5F7A6A] rounded-md px-3 py-2 text-white"
                placeholder="admin@ejemplo.com"
                {...register("email", {
                  required: "El correo es obligatorio",
                })}
              />
              {errors.email && (
                <span className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="bg-[#1F2937] border border-[#5F7A6A] rounded-md px-3 py-2 text-white"
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />
              {errors.password && (
                <span className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-[#10B981] hover:bg-[#0f9d70] text-white py-2 rounded-md font-medium flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Entrar
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage
