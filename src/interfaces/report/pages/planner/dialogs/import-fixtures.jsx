import { useState } from 'react';
import { processPastedFixtures } from './utils';

export default function ImportFixturesDialog({ isOpen, onClose, onImport }) {
    const [fixturesText, setFixturesText] = useState('');

    const handleImport = () => {
        try {
            const result = processPastedFixtures(fixturesText);
            console.log('Processed fixtures:', result);
            onImport(fixturesText);
            setFixturesText('');
            onClose();
        } catch (error) {
            console.error('Error processing fixtures:', error);
            alert(`Error processing fixtures: ${error.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-5xl w-full">
                <h2 className="text-2xl font-bold mb-4">Import Fixtures</h2>
                <div>
                    <textarea
                        className="w-full h-64 p-4 border rounded-md mb-4"
                        placeholder="Paste your fixtures here..."
                        value={fixturesText}
                        onChange={(e) => setFixturesText(e.target.value)}
                    />
                    <SampleFormat />
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={!fixturesText.trim()}
                    >
                        Import
                    </button>
                </div>
            </div>
        </div>
    );
}

function SampleFormat() {
    return (
        <table class="border border-gray-300 mt-1">
            <thead>
                <tr>
                    <th class="border px-2 py-1 bg-gray-100">MATCH</th><th class="border px-2 py-1 bg-gray-100">STAGE</th><th class="border px-2 py-1 bg-gray-100">TEAM1</th><th class="border px-2 py-1 bg-gray-100">TEAM2</th><th class="border px-2 py-1 bg-gray-100">UMPIRES</th><th class="border px-2 py-1 bg-gray-100">DURATION</th><th class="border px-2 py-1 bg-gray-100">TIME</th><th class="border px-2 py-1 bg-gray-100">PITCH</th><th class="border px-2 py-1 bg-gray-100">COMPETITION</th>
                </tr>
            </thead>
            <tbody>

                <tr>
                    <td class="border px-2 py-1">U12.1</td><td class="border px-2 py-1">Grp.1</td><td class="border px-2 py-1">St Marys</td><td class="border px-2 py-1">Westport</td><td class="border px-2 py-1">John Doe</td><td class="border px-2 py-1">15</td><td class="border px-2 py-1">09:00</td><td class="border px-2 py-1">Pitch 1</td><td class="border px-2 py-1">U12 Cup</td>
                </tr>

                <tr>
                    <td class="border px-2 py-1">U14.1</td><td class="border px-2 py-1">Grp.A</td><td class="border px-2 py-1">Castlebar</td><td class="border px-2 py-1">Ballina</td><td class="border px-2 py-1">Jane Smith</td><td class="border px-2 py-1">20</td><td class="border px-2 py-1">09:00</td><td class="border px-2 py-1">Pitch 2</td><td class="border px-2 py-1">U14 Shield</td>
                </tr>

                <tr>
                    <td class="border px-2 py-1">U12.101</td><td class="border px-2 py-1">Cup.SF1</td><td class="border px-2 py-1">Winner U12.1</td><td class="border px-2 py-1">Winner U12.2</td><td class="border px-2 py-1">Winner U12.3</td><td class="border px-2 py-1">15</td><td class="border px-2 py-1">11:00</td><td class="border px-2 py-1">Pitch 1</td><td class="border px-2 py-1">U12 Cup</td>
                </tr>

                <tr>
                    <td class="border px-2 py-1">U12.201</td><td class="border px-2 py-1">Cup.Fin</td><td class="border px-2 py-1">Winner U12.101</td><td class="border px-2 py-1">Winner U12.102</td><td class="border px-2 py-1">Winner U12.103</td><td class="border px-2 py-1">20</td><td class="border px-2 py-1">14:00</td><td class="border px-2 py-1">Main Field</td><td class="border px-2 py-1">U12 Cup</td>
                </tr>

                <tr>
                    <td class="border px-2 py-1">U12.202</td><td class="border px-2 py-1">Cup.3/4</td><td class="border px-2 py-1">Loser U12.101</td><td class="border px-2 py-1">Loser U12.102</td><td class="border px-2 py-1">Loser U12.103</td><td class="border px-2 py-1">15</td><td class="border px-2 py-1">13:00</td><td class="border px-2 py-1">Pitch 2</td><td class="border px-2 py-1">U12 Cup</td>
                </tr>

            </tbody>
        </table>
    );
}
