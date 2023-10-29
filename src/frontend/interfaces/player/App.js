import { Routes, Route } from "react-router-dom";
import Nav from "./Nav";

function App() {
    return <>
        <h1>Radical improvement faw shoo!</h1>
        <Nav />
        <Routes>
            <Route path="/" element={
                <div> Welcome to the home page! </div>
            } />
            <Route path="/about" element={
                <div>What about it?</div>
            } />
        </Routes>
    </>
}

export default App 