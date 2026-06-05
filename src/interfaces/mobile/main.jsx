import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { registerSW } from "virtual:pwa-register"
import App from "./App"

registerSW({
    immediate: true,
    onRegisterError(error) {
        console.error("Service worker registration failed:", error)
    },
})

const container = document.getElementById("app")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
