const Header = ({ title }) => {
  return (
    <header className="bg-[#2E3D36] bg-opacity-90 backdrop-blur-md shadow-lg border-b border-[#4A5C55]">
      <div className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
      </div>
    </header>
  )
}

export default Header
