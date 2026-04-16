import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Packages from './pages/Packages.jsx'

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/category/:categoryId" element={<Packages />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
