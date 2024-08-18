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

const colors = {
  blue: '#83af9b',
  brown: '#774f38',
  beige: '#ece5ce',
};

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
  color: ${colors.brown};
  background-color: ${colors.beige};
  padding: 50px;
  border-radius: 11px;
  box-shadow: 20px 20px ${colors.blue};
  font-family: 'Baloo 2', cursive;
  cursor: pointer;
`;

const ArrowImage = styled.img`
  margin-left: 35px;
  height: 50px;
`;

export default function Name({ handleFilesUpload }) {
    const [fileName, setFileName] = useState("Go to farm");

    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setFileName("Folder selected");

            const csvFiles = Array.from(files).filter(file => file.name.endsWith('.csv'));

            // Trigger the file handling in Home.js
            handleFilesUpload(csvFiles);

            // Smooth scroll after folder selection
            setTimeout(() => {
                const element = document.getElementById("target-section");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 500);
        }
    };

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
                <FloatingText>
                    {fileName}
                </FloatingText>
                <ArrowImage src="arrow.png" alt="Arrow pointing to upload button" />
                <ArrowImage src="words.png" alt="Arrow pointing to upload button" style={{ width: '35%', height: '55%' }} />
            </Container>
        </label>
    );
}
