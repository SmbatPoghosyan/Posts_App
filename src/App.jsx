import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import LandingPageReseller from './components/LandingPageReseller'
import i18n from './i18n'

function Page() {
  const { lang } = useParams()
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang)
  }
  return <LandingPageReseller />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:lang" element={<Page />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
