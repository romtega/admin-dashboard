import { Routes, Route } from "react-router-dom"
import OverviewPage from "@/pages/OverviewPage"
import SpeciesPage from "@/pages/SpeciesPage"
import Sidebar from "@/components/common/Sidebar"

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
        <Route path="/species" element={<SpeciesPage />} />
      </Routes>
    </div>
  )
}

export default App
