import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ResidentInformation from './ResidentInformation.jsx'
import HostelManagement from './assets/HostelRoomManagement.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResidentInformation />
 <HostelManagement/>  
  </StrictMode>,
)
