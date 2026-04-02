import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import Router from "./router.jsx"

createRoot(document.getElementById('root')).render(
    <Router />
)