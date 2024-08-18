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
                  const selectedRows = rows.slice(0, 50).join('\n'); // Get up to 50 rows, or fewer if not available
  
                  const totalRows = rows.length;
                  const emptyRows = rows.filter(row => row.trim() === '').length;
                  const nonEmptyRows = totalRows - emptyRows;
  
                  const description = `File ${file.name} contains ${totalRows} rows, with ${nonEmptyRows} rows of data.`;
                  const dataQuality = emptyRows === 0 ? 'Good' : 'Poor';
                  const health = emptyRows === 0 ? 'Healthy' : 'Needs Attention';
  
                  // Fetch API call here, sending only the rows available (up to 50)
                  try {
                      const response = await fetch('/api/generate', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ content: selectedRows }), // Send the selected rows (up to 50)
                      });
  
                      const data = await response.json();
                      const insights = data.success ? data.data.kwargs.content : 'Error generating insights';
  
                      // Extract the score from the insights content
                      const scoreMatch = insights.match(/Overall health score: (\d+)/);
                      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 'N/A'; // Extract score or default to 'N/A'
  
                      let healthCategory;
                      if (score === 'N/A') {
                          healthCategory = 'Needs Attention';
                      } else if (score < 50) {
                          healthCategory = 'Not Recommended';
                      } else if (score >= 50 && score < 60) {
                          healthCategory = 'Less Than Ideal';
                      } else if (score >= 60 && score < 70) {
                          healthCategory = 'Acceptable';
                      } else if (score >= 70 && score < 80) {
                          healthCategory = 'Good';
                      } else if (score >= 80 && score < 90) {
                          healthCategory = 'Very Good';
                      } else {
                          healthCategory = 'Excellent';
                      }
  
                      console.log("Generated insights:", insights); // Log to check generated insights
                      console.log("Extracted score:", score); // Log to check extracted score
  
                      resolve({
                          name: file.name,
                          content,
                          description,
                          emptyRows,
                          dataQuality,
                          health: healthCategory,    // Include the calculated health here
                          insights,  // Include the generated insights here
                          score,     // Include the extracted score in the file info
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
                          health: 'Needs Attention',  // Default to 'Needs Attention' if there's an error
                          insights: 'Failed to generate insights',  // Default to an error message
                          score: 'N/A',  // Default to N/A if there's an error
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
