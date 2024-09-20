import React, {useContext, useRef, useState, useLayoutEffect, useEffect} from "react";
import {MazeSolverInfoContext} from "./MazeSolverInfoContext";
import {useNavigate} from "react-router-dom";
import { FaPlay, FaPause, FaCopy } from 'react-icons/fa';
import { MdRestartAlt } from "react-icons/md";

function MazeSolving() {

    const navigate = useNavigate();
    const { mazeArr, path, runnerSeq } = useContext(MazeSolverInfoContext);
    const [visitedCells, setVisitedCells] = useState(new Set());
    const mazeContainerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({
        width: 0,
        height: 0
    });

    //Runner Running
    const cellIdxRef = useRef(0);
    const [runnerPos, setRunnerPos] = useState(runnerSeq[0]);
    const [isPaused, setIsPaused] = useState(false);
    function togglePause() {
        setIsPaused(!isPaused);
    }
    const [animationSpeed, setAnimationSpeed] = useState(600);
    function restartAnimation() {
        setRunnerPos(runnerSeq[0]);
        cellIdxRef.current = 0;
        setVisitedCells(new Set());
        setIsPaused(false);
    }
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        let timeoutId;
        function runAnimation() {
            if (cellIdxRef.current < runnerSeq.length && !isPaused) {
                const cell = runnerSeq[cellIdxRef.current];
                setRunnerPos(cell);
                setVisitedCells(prevSet => new Set([...prevSet, `${cell.x},${cell.y}`]));
                cellIdxRef.current = cellIdxRef.current + 1;
                timeoutId = setTimeout(runAnimation, animationSpeed);
            }
            else if(!isPaused){
                setIsCompleted(true);
            }
        }

        runAnimation();
        return () => clearTimeout(timeoutId);
    }, [runnerSeq, animationSpeed, isPaused]);

    const copyPath = async () => {
        try {
            await navigator.clipboard.writeText(path);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
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
    }, [mazeArr]); // Trigger on maze change, if necessary
    // Calculates the max size of each cell depending on available space
    const calculateCellSize = () => {
        const rows = mazeArr.length;
        const cols = mazeArr[0].length;
        // Determine max cell size to fit within the container
        const maxCellWidth = containerSize.width / cols;
        const maxCellHeight = containerSize.height / rows;
        return Math.min(maxCellWidth, maxCellHeight);
    };
    // Aspect ratio preservation
    const aspectRatio = mazeArr[0].length / mazeArr.length;
    let containerHeight = containerSize.height;
    let containerWidth = containerSize.width;

    if (containerWidth / containerHeight > aspectRatio) {
        containerWidth = containerHeight * aspectRatio;
    } else {
        containerHeight = containerWidth / aspectRatio;
    }

    return (
        <div className='mazeSolving-container' style={{alignItems:'center', justifyContent:'space-evenly'}}>
            <div style={{display:'flex', justifyContent:'space-between', width:'90%', height:'70%'}}>
                <div className='card' style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', alignItems:'center', width:'15%', height:'100%'}}>
                    <button className='secondary-button' onClick={togglePause} style={{height:'10%', width:'35%'}} >
                        {isPaused ? <FaPlay /> : <FaPause />}
                    </button>
                    <button className='secondary-button' onClick={restartAnimation}  style={{height:'10%', width:'35%'}} >
                        <MdRestartAlt  style={{width:'90%', height:'90%'}} />
                    </button>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', width:'50%'}} >
                        <label htmlFor="speed-stepper" >Speed</label>
                        <input
                            id="speed-stepper"
                            type="number"
                            className="stepper"
                            value={(10 - animationSpeed/100)+1}
                            onChange={(e) => setAnimationSpeed(1000 - 100*(parseInt(e.target.value)-1))}
                            min="1"
                            max="10"
                            step="1"
                        />
                    </div>
                    <button className='secondary-button' onClick={() => navigate('/init-info')} disabled={!isCompleted && !isPaused}>
                        Run Other Maze
                    </button>
            </div>
                <div className='card' style={{width:'80%', height:'100%', display: 'flex'}} >
                    <div ref={mazeContainerRef} style={{ width: '100%', height: '85%' }} className="maze-container">
                        <div style={{ height: containerHeight*0.95, width: containerWidth*0.9 }}>
                            {mazeArr.map((row, rowIndex) => (
                                <div key={rowIndex} className="maze-row">
                                    {row.map((cell, cellIndex) => {
                                        // Cell Design Logic
                                        const isRunner = runnerPos.y === rowIndex && runnerPos.x === cellIndex;
                                        const isVisited = visitedCells.has(`${cellIndex},${rowIndex}`);
                                        let cellClass = 'maze-cell';
                                        cellClass += cell ? ' wall' : ' path';
                                        if (isRunner) {
                                            cellClass += ' runner';
                                        } else if (isVisited) {
                                            cellClass += ' visited'; // This applies only if not the current runner position
                                        }
                                        return (
                                            <div
                                                key={cellIndex}
                                                className={cellClass}
                                                style={{ width: calculateCellSize(), height: calculateCellSize() }}
                                            ></div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="card" style={{display:'flex', flexDirection:'column', width:'90%', height:'20%', justifyContent:'space-evenly', alignItems:'center', paddingBottom:'1%'}}>
                <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center', gap:'1%'}}>
                    <h3>Path Taken</h3>
                    <button className='secondary-button' style={{width:'3%'}} onClick={copyPath} > <FaCopy /> </button>
                </div>
                <div style={{overflowX:'auto', overflowY:'hidden', whiteSpace:'nowrap', width:'95%', margin:'1%'}}>
                    <p>{path}</p>
                </div>
            </div>
        </div>
    );

}

export default MazeSolving;