'use client';
import Head from 'next/head';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Typography } from "@mui/material";
import Name from './components/Name';
import CSVGremling from './components/CSVGremling';
import DropZone from './components/DropZone';

export default function Home() {
    const [csvFilesInfo, setCsvFilesInfo] = useState([]);

    const updatePosition = (index, x, y) => {
        setCsvFilesInfo(prevInfo =>
            prevInfo.map((fileInfo, i) =>
                i === index ? { ...fileInfo, x, y } : fileInfo
            )
        );
    };

    const handleFilesUpload = async (files) => {
      const filesInfo = await Promise.all(files.map((file, index) => {
          return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = async (event) => {
                  const content = event.target.result;
                  const rows = content.split('\n');
                  const firstFiftyRows = rows.slice(0, 50).join('\n'); // Get the first 50 rows
  
                  const totalRows = rows.length;
                  const emptyRows = rows.filter(row => row.trim() === '').length;
                  const nonEmptyRows = totalRows - emptyRows;
  
                  const description = `File ${file.name} contains ${totalRows} rows, with ${nonEmptyRows} rows of data.`;
                  const dataQuality = emptyRows === 0 ? 'Good' : 'Poor';
                  const health = emptyRows === 0 ? 'Healthy' : 'Needs Attention';
  
                  // Fetch API call here, sending only the first 50 rows
                  try {
                      const response = await fetch('/api/generate', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ content: firstFiftyRows }), // Send only the first 50 rows
                      });
  
                      const data = await response.json();
                      const insights = data.success ? data.data : 'Error generating insights';
  
                      console.log("Generated insights:", insights); // Log to check generated insights
  
                      resolve({
                          name: file.name,
                          content,
                          description,
                          emptyRows,
                          dataQuality,
                          health,
                          insights,  // Include the generated insights here
                          x: 10 + (index * 100),
                          y: 10 + (index * 50),
                      });
                  } catch (error) {
                      console.error("Error during fetch operation:", error);
                      resolve({
                          name: file.name,
                          content,
                          description,
                          emptyRows,
                          dataQuality,
                          health,
                          insights: 'Failed to generate insights',  // Default to an error message
                          x: 10 + (index * 100),
                          y: 10 + (index * 50),
                      });
                  }
              };
              reader.readAsText(file);
          });
      }));
  
      setCsvFilesInfo(filesInfo);
  };
  

    return (
        <DndProvider backend={HTML5Backend}>
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
                        <Name handleFilesUpload={handleFilesUpload} />
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

                    <DropZone updatePosition={updatePosition}>
                        {csvFilesInfo.map((fileInfo, index) => (
                            <CSVGremling key={index} index={index} csvInfo={fileInfo} updatePosition={updatePosition} />
                        ))}
                    </DropZone>
                </main>
            </div>
        </DndProvider>
    );
}
