import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { AppThemeProvider } from './theme/AppThemeProvider.tsx'

const storedTheme = window.localStorage.getItem('theme')
document.documentElement.dataset.theme = storedTheme === 'light' ? 'light' : 'dark'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </StrictMode>,
)
