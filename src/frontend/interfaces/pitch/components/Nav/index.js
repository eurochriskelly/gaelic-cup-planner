import { Link } from "react-router-dom";

function Nav() {
    return <>
        <h2>Select Pitch</h2>
        <h3>This is a test</h3>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/About">About</Link>
            </li>
        </ul>
    </>
}

export default Nav