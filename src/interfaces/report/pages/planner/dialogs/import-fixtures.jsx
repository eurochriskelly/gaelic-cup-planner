import { useState, useEffect } from 'react';
import { processPastedFixtures } from './utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function ImportFixturesDialog({ isOpen, onClose, onImport }) {
    const [fixturesText, setFixturesText] = useState('');
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        if (!fixturesText.trim()) {
            setTableData([]);
            setColumns([]);
            return;
        }

        try {
            const lines = fixturesText.split('\n').filter(line => line.trim());
            if (lines.length < 2) return; // Need at least header + 1 row
            
            const headers = lines[0].split('\t').map(h => h.trim());
            const rows = lines.slice(1).map(line => {
                const values = line.split('\t');
                const row = {};
                headers.forEach((header, i) => {
                    row[header] = values[i]?.trim() || '';
                });
                return row;
            });

            setColumns(headers.map(header => ({
                field: header,
                header: header
            })));
            setTableData(rows);
        } catch (error) {
            console.error('Error parsing TSV:', error);
            setTableData([]);
            setColumns([]);
        }
    }, [fixturesText]);

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
                        className="w-full h-32 p-4 border rounded-md mb-4"
                        placeholder="Paste TSV data here (first row should be headers)..."
                        value={fixturesText}
                        onChange={(e) => setFixturesText(e.target.value)}
                    />
                    {tableData.length > 0 ? (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Preview</h3>
                            <div className="border rounded-md overflow-hidden">
                                <DataTable 
                                    value={tableData}
                                    scrollable 
                                    scrollHeight="300px"
                                    className="p-datatable-sm"
                                >
                                    {columns.map(col => (
                                        <Column 
                                            key={col.field} 
                                            field={col.field} 
                                            header={col.header} 
                                        />
                                    ))}
                                </DataTable>
                            </div>
                        </div>
                    ) : (
                        <SampleFormat />
                    )}
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            try {
                                const result = processPastedFixtures(fixturesText);
                                console.log('Fixture check successful:', result);
                                
                                // Convert CSV back to table data
                                const csvLines = result.csv.split('\n');
                                const csvHeaders = csvLines[0].split(';');
                                const csvRows = csvLines.slice(1).map(line => {
                                    const values = line.split(';');
                                    const row = {};
                                    csvHeaders.forEach((header, i) => {
                                        row[header] = values[i] || '';
                                    });
                                    return row;
                                });

                                setColumns(csvHeaders.map(header => ({
                                    field: header,
                                    header: header
                                })));
                                setTableData(csvRows);
                            } catch (error) {
                                console.error('Error checking fixtures:', error);
                                alert(`Error in fixtures: ${error.message}`);
                                setTableData([]);
                                setColumns([]);
                            }
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        disabled={!fixturesText.trim()}
                    >
                        Check
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

export default ImportFixturesDialog;

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
