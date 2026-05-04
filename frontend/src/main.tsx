import "./polyfills"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ConvexAuthProvider } from "@convex-dev/auth/react"
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL
if (!convexUrl) throw new Error("VITE_CONVEX_URL is not set")

const convex = new ConvexReactClient(convexUrl)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ConvexAuthProvider client={convex}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <BrowserRouter>
            <App />
            <Toaster position="top-right" richColors />
          </BrowserRouter>
        </ThemeProvider>
      </ConvexAuthProvider>
    </ConvexProvider>
  </StrictMode>,
)
