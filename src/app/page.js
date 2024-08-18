'use client';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Button, Typography } from "@mui/material";
import Name from './components/Name';
import CSVGremling from './components/CSVGremling';
import DropZone from './components/DropZone';

export default function Home() {
    const [csvFilesInfo, setCsvFilesInfo] = useState([]);
    const [colorMode, setColorMode] = useState('normal'); // Default color mode

    useEffect(() => {
        // Update the body class when colorMode changes
        document.body.className = colorMode;
    }, [colorMode]);

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
                            health: healthCategory,   
                            insights,  
                            score,    
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
                            health: 'Needs Attention',  
                            insights: 'Failed to generate insights', 
                            score: 'N/A',  
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

    const handleModeChange = (event) => {
        setColorMode(event.target.value);
    };
    useEffect(() => {
      // Apply different background styles based on the color mode
      if (colorMode === 'Normal') {
          document.body.style.background = 'linear-gradient(90deg, rgba(255,246,240,1) 0%, rgba(255,244,236,1) 50%, rgba(255,246,240,1) 100%)';
      } else if (colorMode === 'Deuteranopia') {
          document.body.style.background = 'linear-gradient(90deg, rgb(255, 245, 246) 0%, rgb(255, 245, 246) 50%, rgb(255, 245, 246) 100%)';
      } else if (colorMode === 'Protanopia') {
          document.body.style.background = 'linear-gradient(90deg, rgb(254, 246, 240) 0%, rgb(254, 246, 240) 50%, rgb(254, 246, 240) 100%)';
      } else if (colorMode === 'Tritanopia') {
          document.body.style.background = 'linear-gradient(90deg, rgb(254, 245, 255) 0%, rgb(254, 245, 255) 50%, rgb(254, 245, 255) 100%)';
      }

      // Reset background when component unmounts or colorMode changes
      return () => {
          document.body.style.background = '';
      };
  }, [colorMode]);


      // Define button color variables based on the colorMode
      const buttonColors = {
        normal: '#1976d2',        // Default blue color
        deuteranopia: '#ff5722',  // Orange for Deuteranopia
        protanopia: '#9c27b0',    // Purple for Protanopia
        tritanopia: '#4caf50',    // Green for Tritanopia
    };

    const currentButtonColor = buttonColors[colorMode.toLowerCase()] || buttonColors.normal;

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
                            position: 'absolute',
                            top: 30, 
                            right: 30, 
                            zIndex: 1000,
                            backgroundColor: '#fff', 
                            padding: '8px',
                            borderRadius: '8px',
                        }}
                    >
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Normal</span> 
                                <input 
                                    type="radio" 
                                    name="colorMode" 
                                    value="normal" 
                                    className="radio" 
                                    checked={colorMode === 'normal'}
                                    onChange={handleModeChange}
                                />
                            </label>
                            <label className="label cursor-pointer">
                                <span className="label-text">Deuteranopia</span> 
                                <input 
                                    type="radio" 
                                    name="colorMode" 
                                    value="Deuteranopia" 
                                    className="radio" 
                                    checked={colorMode === 'Deuteranopia'}
                                    onChange={handleModeChange}
                                />
                            </label>
                            <label className="label cursor-pointer">
                                <span className="label-text">Protanopia</span> 
                                <input 
                                    type="radio" 
                                    name="colorMode" 
                                    value="Protanopia" 
                                    className="radio" 
                                    checked={colorMode === 'Protanopia'}
                                    onChange={handleModeChange}
                                />
                            </label>
                            <label className="label cursor-pointer">
                                <span className="label-text">Tritanopia</span> 
                                <input 
                                    type="radio" 
                                    name="colorMode" 
                                    value="Tritanopia" 
                                    className="radio" 
                                    checked={colorMode === 'Tritanopia'}
                                    onChange={handleModeChange}
                                />
                            </label>
                        </div>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100vh',
                            textAlign: 'center',
                            flexDirection: 'column',
                        }}>
                        <Button
                            variant="contained"
                            sx={{ 
                                marginBottom: '20px',
                                backgroundColor: currentButtonColor,
                                '&:hover': {
                                    backgroundColor: currentButtonColor,
                                },
                            }}
                            href="/farm.zip"
                            download
                        >
                            Download Farm Folder
                        </Button>
                        <Name handleFilesUpload={handleFilesUpload} colorMode={colorMode} />
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '4rem', sm: '4.5rem', md: '5rem' },
                                lineHeight: 1.2,
                                margin: '25px 0',
                                color: 'black'
                            }}
                        >
                            CSV Health Checker
                        </Typography>
                    </Box>

                    <DropZone updatePosition={updatePosition}>
                        {csvFilesInfo.map((fileInfo, index) => (
                            <CSVGremling key={`${fileInfo.name}-${colorMode}`} index={index} csvInfo={fileInfo} updatePosition={updatePosition} colorMode={colorMode} />
                        ))}
                    </DropZone>
                </main>
            </div>
        </DndProvider>
    );
}