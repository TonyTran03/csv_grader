import React from 'react';
import { useDrop } from 'react-dnd';

export default function DropZone({ children, updatePosition }) {
    const [, drop] = useDrop(() => ({
        accept: 'CSV',
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset();
            const dropZone = document.getElementById('target-section');
            if (offset && dropZone) {
                const dropZoneRect = dropZone.getBoundingClientRect();
                const x = offset.x - dropZoneRect.left;
                const y = offset.y - dropZoneRect.top;

                // Check if the position is within bounds
                if (x >= 0 && x <= dropZoneRect.width && y >= 0 && y <= dropZoneRect.height) {
                    updatePosition(item.index, x, y);
                } else {
                    // Position is out of bounds, so we don't update the position (illegal move)
                    console.log("Out of bounds, position not updated");
                }
            }
        },
    }));

    return (
        <div
            id="target-section"
            ref={drop}
            style={{
                position: 'absolute',
                width: '60%',
                height: '100%',
                background: 'rgba(40, 41, 42, 0.8)', // Just for visual reference
            }}
        >
            {children}
        </div>
    );
}
