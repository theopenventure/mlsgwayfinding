import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router'
import './index.css'
import './lib/leafletSetup'
import App from './App.jsx'
import ExplorePage from './pages/ExplorePage.jsx'

function RedirectProvider() {
  const { slug } = useParams()
  return <Navigate to={`/services?provider=${slug}`} replace />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/services" element={<ExplorePage />} />
          <Route path="/services/results" element={<Navigate to="/services" replace />} />
          <Route path="/services/provider/:slug" element={<RedirectProvider />} />
          <Route index element={<Navigate to="/services" replace />} />
          <Route path="*" element={<Navigate to="/services" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
