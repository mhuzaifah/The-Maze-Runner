import React, {useLayoutEffect, useRef, useState} from 'react';

const Maze = ({ maze }) => {

    const mazeContainerRef = useRef(null);

    const [containerSize, setContainerSize] = useState({
        width: 0,
        height: 0
    });

    useLayoutEffect(() => {
        function updateSize() {
            if (mazeContainerRef.current) {
                setContainerSize({
                    width: mazeContainerRef.current.offsetWidth,
                    height: mazeContainerRef.current.offsetHeight
                });
            }
        }

        window.addEventListener('resize', updateSize);
        updateSize(); // Initial size
        return () => window.removeEventListener('resize', updateSize);

    }, [maze]); // Trigger on maze change, if necessary

    const calculateCellSize = () => {
        const rows = maze.length;
        const cols = maze[0].length;
        // Determine max cell size to fit within the container
        const maxCellWidth = containerSize.width / cols;
        const maxCellHeight = containerSize.height / rows;
        return Math.min(maxCellWidth, maxCellHeight);
    };

    //add aspect ratio preservation
    const aspectRatio = maze[0].length / maze.length;
    let height = containerSize.height;
    let width = containerSize.width;

    if (width / height > aspectRatio) {
        width = height * aspectRatio;
    } else {
        height = width / aspectRatio;
    }

    return (
        <div ref={mazeContainerRef} style={{ width: '90%', height: '85%' }} className="maze-container">
            <div style={{ height: height, width: width }}>
                {maze.map((row, rowIndex) => (
                    <div key={rowIndex} className="maze-row">
                        {row.map((cell, cellIndex) => (
                            <div
                                key={cellIndex}
                                className={`maze-cell ${cell ? 'wall' : 'path'}`}
                                style={{ width: calculateCellSize(), height: calculateCellSize() }}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Maze;