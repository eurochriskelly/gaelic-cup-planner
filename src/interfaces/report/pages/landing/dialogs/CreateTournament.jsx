function CreateTournamentModal({ onClose, isOpen, regions = [] }) {
    if (!isOpen) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate code format
        const codeRegex = /^[A-Za-z0-9]{4}$/;
        if (!codeRegex.test(data.code)) {
            alert('Code must be 4 alphanumeric characters');
            return;
        }
        
        console.log('Form data:', data);
    };

    const modalContentStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        zIndex: 50,
        maxHeight: '90vh',
        overflowY: 'auto',
        minWidth: '300px',
    };

    return (
        <div id="create-tournament-modal-content" style={modalContentStyle}>
            <div id="create-tournament-form" className="p-5 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Create a New Tournament</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="region" className="block mb-1">Region:</label>
                        <select id="region" name="region" required className="w-full p-2 border rounded">
                            <option value="">Select a region</option>
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="title" className="block mb-1">Title:</label>
                        <input type="text" id="title" name="title" required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label htmlFor="date" className="block mb-1">Date:</label>
                        <input type="date" id="date" name="date" required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label htmlFor="location" className="block mb-1">Location:</label>
                        <input type="text" id="location" name="location" required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label htmlFor="lat" className="block mb-1">Latitude (optional):</label>
                        <input type="number" id="lat" name="lat" step="any" className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label htmlFor="lon" className="block mb-1">Longitude (optional):</label>
                        <input type="number" id="lon" name="lon" step="any" className="w-full p-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="winPoints" className="block mb-1">Win Points:</label>
                            <input 
                                type="number" 
                                id="winPoints" 
                                name="winPoints" 
                                defaultValue="3"
                                min="0"
                                className="w-full p-2 border rounded" 
                            />
                        </div>
                        <div>
                            <label htmlFor="drawPoints" className="block mb-1">Draw Points:</label>
                            <input 
                                type="number" 
                                id="drawPoints" 
                                name="drawPoints" 
                                defaultValue="1"
                                min="0"
                                className="w-full p-2 border rounded" 
                            />
                        </div>
                        <div>
                            <label htmlFor="losePoints" className="block mb-1">Lose Points:</label>
                            <input 
                                type="number" 
                                id="losePoints" 
                                name="losePoints" 
                                defaultValue="0"
                                min="0"
                                className="w-full p-2 border rounded" 
                            />
                        </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                        <label htmlFor="code" className="block mb-1">Tournament Code:</label>
                        <input 
                            type="text" 
                            id="code" 
                            name="code" 
                            required 
                            pattern="[A-Za-z0-9]{4}"
                            className="w-full p-2 border rounded"
                            placeholder="ABCD"
                        />
                        <small className="text-gray-500">4 alphanumeric characters</small>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Create
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTournamentModal;