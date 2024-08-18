import React from 'react';
import { Typography } from '@mui/material';

export default function CSVSummary({ csvInfo, colorMode }) {
    const insightsContent = csvInfo.insights || 'No insights available';
    const score = csvInfo.score || 'N/A';

    // Determine the sprite based on the health category and color mode
    let spriteSrc;
    switch (csvInfo.health) {
        case 'Excellent':
        case 'Very Good':
            spriteSrc = `/${colorMode}/green.svg`;
            break;
        case 'Good':
        case 'Acceptable':
            spriteSrc = `/${colorMode}/pink.svg`;
            break;
        case 'Less Than Ideal':
        case 'Not Recommended':
            spriteSrc = `/${colorMode}/purple.svg`;
            break;
        case 'Needs Attention':
        default:
            spriteSrc = `/${colorMode}/red.svg`;
            break;
    }

    const previewRows = csvInfo.content ? csvInfo.content.split('\n').slice(0, 5) : [];
    const previewData = previewRows.map(row => row.split(','));

    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg" style={{ height: '100%' }}>
            <h2 className="text-2xl font-bold mb-4">CSV SUMMARY</h2>

            <div className="flex justify-between items-center">
                <div className="flex-shrink-0">
                    <img
                        src={spriteSrc}
                        alt={csvInfo.name}
                        className="block mx-auto mb-4"
                        style={{
                            width: '150px',
                            height: '150px',
                            imageRendering: 'pixelated',
                        }}
                    />
                </div>

                <div className="ml-7 flex-grow">
                    <p><strong>Type:</strong> CSV</p>
                    <p><strong>Health:</strong> {csvInfo.health}</p>
                </div>

                <div>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '6rem', 
                            lineHeight: 1.2,
                            textAlign: 'right',
                            mr: 7, 
                            color: '#fff'
                        }}
                    >
                        {score}%
                    </Typography>
                </div>
            </div>

            <div className="mt-4">
                <p><strong>Name:</strong> {csvInfo.name}</p>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Insights</h3>
                <p>{insightsContent}</p>
            </div>

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
