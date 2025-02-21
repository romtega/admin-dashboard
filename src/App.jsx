import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/species" element={<SpeciesPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
