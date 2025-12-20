import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/pages/Dashboard'
import Transactions from './components/pages/Transactions'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
