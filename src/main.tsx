import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import TapparellaCard from './TapparellaCard'

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <TapparellaCard />
    </StrictMode>,
  )
  