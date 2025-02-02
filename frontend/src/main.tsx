import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="bg-no-repeat bg-cover bg-fixed" style={{ backgroundImage: "url('/bg.jpg')"}}>
      <App />
    </div>
  </StrictMode>,
)