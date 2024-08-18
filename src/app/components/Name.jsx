import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% {
    transform: translatey(0px);
  }
  50% {
    transform: translatey(2px);
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
  top: 64%;
  left: 62%;
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease-out; /* Smooth transition for parallax effect */
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
  cursor: pointer; /* Make it look clickable */
`;

const ArrowImage = styled.img`
  margin-left: 35px; /* Adjust this to position the arrow correctly */
  height: 50px; /* Adjust size as needed */
`;

export default function Name() {
    const [fileName, setFileName] = useState("Go to farm");

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY; // Use window.scrollY instead of pageYOffset
            const parallaxEffect = scrollPosition * 0.2; // Adjust the factor for desired effect

            document.getElementById('parallax-container').style.transform = `translate(-50%, calc(-50% + ${parallaxEffect}px))`;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setFileName("Folder selected");

            // Trigger smooth scroll after folder selection
            setTimeout(() => {
                const element = document.getElementById("target-section");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 500); // Adjust delay if necessary
        }
    };

    return (
        <label className="cursor-pointer">
            <input
                type="file"
                webkitdirectory="true"  // Allows folder selection
                directory="true"         // Allows folder selection
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
