'use client';
import Head from 'next/head';
import { useState } from 'react';
import { Box, Typography } from "@mui/material";
import Name from './components/Name';
import CSVGremling from './components/CSVGremling';

export default function Home() {
    const [csvFilesInfo, setCsvFilesInfo] = useState([]);

    const handleFilesUpload = (files) => {
        const filesInfo = files.map(file => {
            const rows = file.content.split('\n');
            const totalRows = rows.length;
            const emptyRows = rows.filter(row => row.trim() === '').length;
            const nonEmptyRows = totalRows - emptyRows;

            const description = `File ${file.name} contains ${totalRows} rows, with ${nonEmptyRows} rows of data.`;
            const dataQuality = emptyRows === 0 ? 'Good' : 'Poor';
            const health = emptyRows === 0 ? 'Healthy' : 'Needs Attention';

            return {
                name: file.name,
                description,
                emptyRows,
                dataQuality,
                health
            };
        });

        setCsvFilesInfo(filesInfo);
    };

    return (
        <div>
            <Head>
                <title>CSV Health Checker</title>
                <meta name="description" content="Check the health of your CSV files" />
            </Head>
            
            <main>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        textAlign: 'center',
                        flexDirection: 'column',
                    }}>
                    <Name />
                    
                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '4rem', sm: '4.5rem', md: '5rem' },
                            lineHeight: 1.2,
                            margin: '20px 0',
                        }}
                    >
                        CSV Health Checker
                    </Typography>
                </Box>

                {/* New Section with Black Background */}
                <div style={{ height: '100vh', backgroundColor: '#28292A' }}></div>

                <div className="flex flex-wrap gap-4">
                    {csvFilesInfo.length > 0 && csvFilesInfo.map((fileInfo, index) => (
                        <CSVGremling key={index} csvInfo={fileInfo} />
                    ))}
                </div>
            </main>
        </div>
    );
}
