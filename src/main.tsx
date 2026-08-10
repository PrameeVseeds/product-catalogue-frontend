import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { SiteContentProvider } from './hooks/siteContentProvider'
import { appRouter } from './routes/appRoutes'
import './styles/theme.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteContentProvider><RouterProvider router={appRouter} /></SiteContentProvider>
  </StrictMode>,
)
