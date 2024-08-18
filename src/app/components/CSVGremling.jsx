import React from 'react';

export default function CSVGremling({ csvInfo }) {
    return (
        <div className="tooltip tooltip-right" data-tip={`
            Description: ${csvInfo.description}
            Empty rows: ${csvInfo.emptyRows}
            Data Quality: ${csvInfo.dataQuality}
            Health: ${csvInfo.health}
        `}>
            <img src="/protanopia/green.svg" alt="CSV Gremling" />
        </div>
    );
}
