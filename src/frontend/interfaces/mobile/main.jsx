import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"

console.log(' testing')
const container = document.getElementById("app")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
