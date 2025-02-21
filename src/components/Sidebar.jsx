import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart2,
  NotebookPen,
  Sprout,
  MapPin,
  MountainSnow,
  CloudRain,
  User,
  Menu,
} from "lucide-react"
import { Link } from "react-router-dom"

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "text-blue-400", href: "/" },
  { name: "Species", icon: Sprout, color: "text-green-400", href: "/species" },
  { name: "Location", icon: MapPin, color: "text-teal-400", href: "/location" },
  { name: "Blog", icon: NotebookPen, color: "text-purple-400", href: "/blog" },
  {
    name: "Soil Structure",
    icon: MountainSnow,
    color: "text-yellow-400",
    href: "/soil-structure",
  },
  {
    name: "Weather",
    icon: CloudRain,
    color: "text-blue-300",
    href: "/weather",
  },
  {
    name: "Admin Info",
    icon: User,
    color: "text-red-400",
    href: "/admin-info",
  },
]

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-[#2E3D36] bg-opacity-90 backdrop-blur-md p-4 flex flex-col border-r border-[#4A5C55] shadow-lg">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full bg-[#44475A] hover:bg-[#6272A4] transition-colors max-w-fit"
        >
          <Menu size={24} className="text-gray-200" />
        </motion.button>
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map(item => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[#44475A] transition-colors mb-2">
                <item.icon size={20} className={`${item.color} min-w-[20px]`} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap text-gray-200"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  )
}

export default Sidebar
