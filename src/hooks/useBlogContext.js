import { useContext } from "react"
import { BlogContext } from "@/context/BlogContext" // Ajusta la ruta según sea necesario

export function useBlogContext() {
  const context = useContext(BlogContext)

  if (!context) {
    throw new Error("useBlogContext must be used within a BlogProvider")
  }

  return context
}
