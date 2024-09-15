import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CustomMazeContext } from "./CustomMazeContext";

const CustomMaze = () => {
    const { width, height, customMazeArr, setCustomMazeArr, mazePOI, setMazePOI, initEntryAndExit } = useContext(CustomMazeContext);
    const mazeContainerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({
        width: 0,
        height: 0
    });
    const [mouseDown, setMouseDown] = useState(false);

    // Update entry and exit points when width or height changes
    useEffect(() => {
        setMazePOI(initEntryAndExit()); // Reset entry and exit points
    }, [width, height, initEntryAndExit, setMazePOI]);

    // Mouse Cell State Changers
    const handleCellStateChange = (rowIdx, colIdx) => {
        if (rowIdx === 0 || rowIdx === height - 1) {
            return;
        }

        setCustomMazeArr(prevMaze => {
            const newMaze = prevMaze.map((row, rIdx) =>
                row.map((cell, cIdx) => cell)
            );

            if (colIdx === 0) {
                // Toggle the previous entry cell
                const { row: prevEntryRow, col: prevEntryCol } = mazePOI.entry;
                newMaze[prevEntryRow][prevEntryCol] = !newMaze[prevEntryRow][prevEntryCol];

                setMazePOI(prevPOI => ({ ...prevPOI, entry: { row: rowIdx, col: colIdx } }));
            } else if (colIdx === width - 1) {
                // Toggle the previous exit cell
                const { row: prevExitRow, col: prevExitCol } = mazePOI.exit;
                newMaze[prevExitRow][prevExitCol] = !newMaze[prevExitRow][prevExitCol];

                setMazePOI(prevPOI => ({ ...prevPOI, exit: { row: rowIdx, col: colIdx } }));
            }

            newMaze[rowIdx][colIdx] = !newMaze[rowIdx][colIdx];

            return newMaze;
        });
    };
    const handleMouseDown = (rowIdx, colIdx) => {
        setMouseDown(true);
        handleCellStateChange(rowIdx, colIdx);
    };
    const handleMouseUp = () => {
        setMouseDown(false);
    };
    const handleMouseEnter = (rowIdx, colIdx) => {
        if (mouseDown)
            handleCellStateChange(rowIdx, colIdx);
    };
    const handleMouseLeave = () => {
        setMouseDown(false);
    };

    // Updates Available Container Space
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
    }, [customMazeArr]); // Trigger on maze change, if necessary

    // Calculates the max size of each cell depending on available space
    const calculateCellSize = () => {
        const rows = customMazeArr.length;
        const cols = customMazeArr[0].length;
        // Determine max cell size to fit within the container
        const maxCellWidth = containerSize.width / cols;
        const maxCellHeight = containerSize.height / rows;
        return Math.min(maxCellWidth, maxCellHeight);
    };
    // Aspect ratio preservation
    const aspectRatio = customMazeArr.length > 0 ? customMazeArr[0].length / customMazeArr.length : 1;
    let containerHeight = containerSize.height;
    let containerWidth = containerSize.width;

    if (containerWidth / containerHeight > aspectRatio) {
        containerWidth = containerHeight * aspectRatio;
    } else {
        containerHeight = containerWidth / aspectRatio;
    }

    return (
        <div ref={mazeContainerRef} style={{ width: '90%', height: '85%' }} className="maze-container">
            <div style={{ height: containerHeight, width: containerWidth }} onMouseLeave={handleMouseLeave}>
                {customMazeArr.map((row, rowIndex) => (
                    <div key={rowIndex} className="maze-row">
                        {row.map((cell, cellIndex) => (
                            <div
                                key={cellIndex}
                                className={`maze-cell ${cell ? 'wall' : 'path'}`}
                                style={{ width: calculateCellSize(), height: calculateCellSize() }}
                                onMouseDown={() => handleMouseDown(rowIndex, cellIndex)}
                                onMouseUp={handleMouseUp}
                                onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomMaze;