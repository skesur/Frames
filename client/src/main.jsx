import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

createRoot(document.getElementById('root')).render(<App />)
