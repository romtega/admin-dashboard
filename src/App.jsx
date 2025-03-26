import { Routes, Route } from "react-router-dom"
import OverviewPage from "@/pages/OverviewPage"
import SpeciesPage from "@/pages/SpeciesPage"
import Sidebar from "@/components/common/Sidebar"
import SoilStructurePage from "./pages/SoilStructurePage"
import BlogPage from "./pages/BlogPage"
import AdminProfilePage from "./pages/AdminProfilePage"
import WeatherPage from "./pages/WeatherPage"

function App() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-green-100 via-emerald-200 to-teal-300 text-gray-900 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-200 to-teal-400 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/soil-structure" element={<SoilStructurePage />} />
        <Route path="/species" element={<SpeciesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/admin" element={<AdminProfilePage />} />
        <Route path="/weather" element={<WeatherPage />} />
      </Routes>
    </div>
  )
}

export default App
