import React, {createContext, useState} from "react";

export const MazeSolverInfoContext = createContext();

export const MazeSolverInfoProvider = ({ children }) => {

    const [mode, setMode] = useState('solve');
    const [maze, setMaze] = useState('custom');
    const [mazeArr, setMazeArr] = useState(
        [
            [true, true, true, true, true, true, true],
            [true, false, false, false, false, false, true],
            [true, false, true, true, true, false, true],
            [true, false, false, false, false, false, true],
            [true, false, true, true, true, false, true],
            [true, false, false, false, false, false, true],
            [true, true, true, true, true, true, true],
        ]
    );
    const [method, setMethod] = useState('righthand');
    const [pathToVerify, setPathToVerify] = useState('');
    const [path, setPath] = useState('');
    const [runnerSeq, setRunnerSeq] = useState([]);

    return (
        <MazeSolverInfoContext.Provider value={{mode, setMode, maze, setMaze, mazeArr, setMazeArr,  method, setMethod, pathToVerify, setPathToVerify, path, setPath, runnerSeq, setRunnerSeq}}>
            { children }
        </MazeSolverInfoContext.Provider>
    );

};