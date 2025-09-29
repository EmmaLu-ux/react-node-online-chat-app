import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { SocketProvide } from "./context/SocketContext.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvide>
      <App />
    </SocketProvide>
  </StrictMode>
)
