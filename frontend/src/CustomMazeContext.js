import React, {createContext, useCallback, useState} from "react";

export const CustomMazeContext = createContext();

export const CustomMazeProvider = ({ children }) => {

    const [width, setWidth] = useState(25);
    const [height, setHeight] = useState(25);

    // Initialize entry and exit points
    const initEntryAndExit = useCallback(() => ({
        entry: { row: 1, col: 0 },
        exit: { row: height - 2, col: width - 1 }
    }), [width, height]);
    const [mazePOI, setMazePOI] = useState(initEntryAndExit);     // State for entry and exit points

    // Function to create the initial maze
    const createInitMaze = useCallback(() => {
        const maze = Array.from({ length: height }, () => Array(width).fill(false));
        for (let rIdx = 0; rIdx < height; rIdx++) {
            for (let cIdx = 0; cIdx < width; cIdx++) {
                if (rIdx === 0 || rIdx === height - 1 || cIdx === 0 || cIdx === width - 1) {
                    if (!((rIdx === mazePOI.entry.row && cIdx === mazePOI.entry.col) || (rIdx === mazePOI.exit.row && cIdx === mazePOI.exit.col))) {
                        maze[rIdx][cIdx] = true; // Set outer edges as walls, except for entry and exit points
                    }
                }
            }
        }
        return maze;
    }, [height, width, mazePOI]);
    const [customMazeArr, setCustomMazeArr] = useState(createInitMaze);

    return (
        <CustomMazeContext.Provider value={{ width, setWidth, height, setHeight, customMazeArr, setCustomMazeArr, mazePOI, setMazePOI, createInitMaze, initEntryAndExit }}>
            { children }
        </CustomMazeContext.Provider>
    );
};