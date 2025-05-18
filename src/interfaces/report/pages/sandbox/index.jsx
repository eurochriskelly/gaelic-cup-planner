function Sandbox() {
    return (
        <div>
            <h1>Sandbox</h1>
            <p>This is the sandbox page.</p>
            <ul className="links flex flex-col gap-4">
                <li>
                    <a href="/planning/1/matches" className="text-blue-500 hover:underline">
                        Go to Planning Page
                    </a>
                </li>
                <li>
                    <a href="/execution/1/recent" className="text-blue-500 hover:underline">
                        Go to Execution Page
                    </a>
                </li>
                <li>
                    <a href="/new-feature" className="text-blue-500 hover:underline">
                        Go to New Feature Page
                    </a>
                </li>
            </ul>
        </div>
    );
}
export default Sandbox;