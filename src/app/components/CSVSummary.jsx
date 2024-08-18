import React from 'react';

export default function CSVSummary({ csvInfo }) {
    // Extract insights content if available
    const insightsContent = csvInfo.insights?.kwargs?.content || 'No insights available';

    const previewRows = csvInfo.content ? csvInfo.content.split('\n').slice(0, 5) : [];
    const previewData = previewRows.map(row => row.split(','));

    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg" style={{ height: '100%' }}>
            <h2 className="text-2xl font-bold mb-4">CSV SUMMARY</h2>

            <div className="flex">
                <div className="flex-shrink-0">
                    <img
                        src="/green.svg"
                        alt={csvInfo.name}
                        className="block mx-auto mb-4"
                        style={{
                            width: '150px',
                            height: '150px',
                            imageRendering: 'pixelated',
                        }}
                    />
                </div>

                <div className="ml-7">
                    <p><strong>Type:</strong> CSV</p>
                    <p><strong>Health:</strong> {csvInfo.health}</p>
                    <p>(Other metadata)</p>
                </div>
            </div>

            <div className="mt-4">
                <p><strong>Name:</strong> {csvInfo.name}</p>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Insights</h3>
                <p>{insightsContent}</p> {/* Display the extracted insights content */}
            </div>

            {/* CSV Preview */}
            {csvInfo.content && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">CSV Preview</h3>
                    <div className="overflow-auto">
                        <table className="table-auto w-full text-sm text-left text-white">
                            <tbody>
                                {previewData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex} className="border px-2 py-1">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
