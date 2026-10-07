import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Site } from './Site'
import './reset.css'

const root = document.getElementById('root')!
const app = <StrictMode><Site pathname={window.location.pathname} /></StrictMode>

// Production HTML already contains the page; development starts with an empty root.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
