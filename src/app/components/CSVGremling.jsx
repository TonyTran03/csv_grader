import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import CSVSummary from './CSVSummary';

export default function CSVGremling({ csvInfo, index, updatePosition, colorMode }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CSV',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const offset = monitor.getClientOffset();
            const dropZone = document.getElementById('target-section');
            if (offset && dropZone) {
                const dropZoneRect = dropZone.getBoundingClientRect();
                const x = offset.x - dropZoneRect.left;
                const y = offset.y - dropZoneRect.top;
                updatePosition(item.index, x, y);
            }
        },
    }));

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);
    const openDrawer = () => {
        closeDropdown();  
        setIsDrawerOpen(true);
    };
    const closeDrawer = () => setIsDrawerOpen(false);

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

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    left: `${csvInfo.x}px`,
                    top: `${csvInfo.y}px`,
                    textAlign: 'center',
                    pointerEvents: isDragging ? 'none' : 'auto',
                }}
            >
                <div
                    style={{
                        marginBottom: '5px',
                        color: '#ffffff',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    title={csvInfo.name}
                >
                    {csvInfo.name}
                </div>

                <div ref={drag} className={`dropdown ${isDropdownOpen ? 'dropdown-open' : ''}`}>
                    <label
                        tabIndex={0}
                        className="tooltip tooltip-top"
                
                        onClick={toggleDropdown}
                    >
                        <img
                            src={spriteSrc}
                            alt={csvInfo.name}
                            style={{
                                width: '70px',
                                height: '70px',
                                opacity: isDragging ? 0.5 : 1,
                                cursor: 'grab',
                            }}
                        />
                    </label>
                    {isDropdownOpen && (
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-gray-700 rounded-box w-52">
                            <li><button onClick={openDrawer}>Summary</button></li>
                            <li><button onClick={closeDropdown}>Cancel</button></li>
                        </ul>
                    )}
                </div>
            </div>

            {/* Drawer */}
            {isDrawerOpen && (
                <div
                    className="fixed top-0 right-0 h-full bg-gray-800 p-4 shadow-lg"
                    style={{ width: '40%', position: 'fixed', right: 0, zIndex: 1000 }} // Ensure it stays on the right side
                >
                    <button 
                        onClick={closeDrawer} 
                        className="absolute top-2 right-2 text-white"
                        aria-label="Close drawer"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                        }}
                    >
                        &times;
                    </button>
                    <CSVSummary csvInfo={csvInfo} colorMode={colorMode} />
                </div>
            )}

        </>
    );
}
