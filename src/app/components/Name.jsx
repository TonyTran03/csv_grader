import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% {
    transform: translatey(0px);
  }
  50% {
    transform: translatey(-20px);
  }
  100% {
    transform: translatey(0px);
  }
`;

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  top: 65%;
  left: 62%;
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease-out;
`;

const FloatingText = styled.p`
  transform: translatey(0px);
  animation: ${float} 5s ease-in-out infinite;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 3px;
  font-size: 15px;
  padding: 50px;
  border-radius: 11px;
  font-family: 'Baloo 2', cursive;
  cursor: pointer;
  color: ${(props) => props.textColor};
  background-color: ${(props) => props.bgColor};
  box-shadow: 20px 20px ${(props) => props.shadowColor};
`;

const ArrowImage = styled.img`
  margin-left: 35px;
  height: 50px;
`;

export default function Name({ handleFilesUpload, colorMode }) {
    const [fileName, setFileName] = useState("Go to farm");

    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setFileName("Folder selected");

            const csvFiles = Array.from(files).filter(file => file.name.endsWith('.csv'));

            handleFilesUpload(csvFiles);

            setTimeout(() => {
                const element = document.getElementById("target-section");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 500);
        }
    };

    // Define color variables based on the colorMode
    const colors = {
        normal: {
            textColor: '#774f38',
            bgColor: '#ece5ce',
            shadowColor: '#83af9b',
        },
        deuteranopia: {
            textColor: '#5a5a5a',
            bgColor: '#e0e0e0',
            shadowColor: '#a2a2a2',
        },
        protanopia: {
            textColor: '#595959',
            bgColor: '#d9d9d9',
            shadowColor: '#9e9e9e',
        },
        tritanopia: {
            textColor: '#4f4f4f',
            bgColor: '#d1d1d1',
            shadowColor: '#8f8f8f',
        },
    };

    const currentColors = colors[colorMode.toLowerCase()] || colors.normal;

    return (
        <label className="cursor-pointer">
            <input
                type="file"
                webkitdirectory="true"
                directory="true"
                onChange={handleFileUpload}
                style={{ display: "none" }}
            />
            <Container id="parallax-container">
                <FloatingText
                    textColor={currentColors.textColor}
                    bgColor={currentColors.bgColor}
                    shadowColor={currentColors.shadowColor}
                >
                    {fileName}
                </FloatingText>
                <ArrowImage src="arrow.png" alt="Arrow pointing to upload button" />
                <ArrowImage src="words.png" alt="Arrow pointing to upload button" style={{ width: '35%', height: '55%' }} />
            </Container>
        </label>
    );
}
