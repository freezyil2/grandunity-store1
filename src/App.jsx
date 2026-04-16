import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Packages from './pages/Packages.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import BackToTop from './components/BackToTop.jsx'
import CheckoutStatusToast from './components/CheckoutStatusToast.jsx'
import About from './pages/About.jsx'
import Support from './pages/Support.jsx'
import Terms from './pages/Terms.jsx'

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <ScrollToTop />
      <ScrollProgress />
      <CheckoutStatusToast />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/category/:categoryId" element={<Packages />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <BackToTop />
      <Footer />
    </div>
  )
}
