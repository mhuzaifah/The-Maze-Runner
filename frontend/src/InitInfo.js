import React, {useContext, useEffect} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Maze from "./Maze";
import CustomMaze from "./CustomMaze";
import {CustomMazeContext} from "./CustomMazeContext";
import {MazeSolverInfoContext} from "./MazeSolverInfoContext";

function InitInfo() {

    const MAZERUNNER_REST_API_URL = process.env.REACT_APP_SPRINGBOOT_API_URL;
    const { maze, setMaze, mode, setMode, method, setMethod, pathToVerify, setPathToVerify, mazeArr, setMazeArr, setPath, setRunnerSeq } = useContext(MazeSolverInfoContext);
    const { customMazeArr, width, setWidth, height, setHeight } = useContext(CustomMazeContext);

    useEffect(() => {

        const fetchMaze = async () => {
            try {
                if (!MAZERUNNER_REST_API_URL) {
                    console.error('API key is missing!');
                }
                const response = await axios.get(MAZERUNNER_REST_API_URL, {
                    params: { mazeFile: maze }
                })
                setMazeArr(() => response.data);
            } catch (error) {
                console.error("Error fetching maze:", error);
            }
        };

        if(maze !== 'custom')
            fetchMaze();
    }, [maze, setMazeArr, setMethod, MAZERUNNER_REST_API_URL]);

    const addMovement = (movement) => {
        setPathToVerify(prevPath => `${prevPath}${movement} `); // Appends the movement and a space for separation
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const initInfo = {
            mode : mode,
            maze : maze,
            mazeArr : maze === 'custom' ? customMazeArr : null, // only if custom maze selected
            method : mode === 'solve' ? method : '', // method only for solve mode
            pathToVerify : mode === 'validate' ? pathToVerify : '', // movements only for validate mode
        };

        try {
            const response = await axios.post(MAZERUNNER_REST_API_URL, JSON.stringify(initInfo), {
                headers: { 'Content-Type': 'application/json' }
            });
            setPath(response.data.path);
            setRunnerSeq(response.data.runnerSeq);

            if(maze === 'custom')
                setMazeArr(customMazeArr);

            setTimeout(() => navigate("/maze-solving"), 0);
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const methodDesc = (method) => {
        switch (method) {
            case 'righthand': return <p>The runner always keep its right hand on the wall and follows it to find its way out. This works in simple mazes without loops</p>
            case 'tremaux': return  <p>The runner marks each path as it traverses. If it encounters a marked path, it backtracks and tries a different route, ensuring it explores all possible paths</p>
            case 'bfs': return  <p>The runner explores all possible paths level by level, ensuring it finds the shortest path to the exit by checking the nearest nodes first.</p>
            case 'dfs': return <p>The runner dives deep into one path, exploring as far as possible before backtracking and trying a different route, which can lead to finding a solution but not necessarily the shortest one.</p>
            default: return  <p>Valid method not chosen.</p>
        }
    }

    return (
        <div className="initInfo-container">
            <div style={{height:'85%', display:'flex', justifyContent:'space-around'}} >
                <form onSubmit={(e) => handleSubmit(e)} style={{width:'35%', display:'flex', flexDirection:'column', justifyContent:'space-between'}} >
                    <div className="card" style={{height:'30%', display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'center', paddingTop:'7.5%', gap:'25%'}} >
                        <label htmlFor="mode" style={{fontSize:'1.5em'}} >Mode</label>
                        <div className="radio-inputs" style={{width:'90%'}}>
                            <label className="radio">
                                <input type="radio" name="mode" value="solve" checked={mode === 'solve'} onChange={(e) => setMode(e.target.value)} />
                                <span className="name" >Solve Maze</span>
                            </label>
                            <label className="radio">
                                <input type="radio" name="mode" value="validate" checked={mode === 'validate'} onChange={(e) => setMode(e.target.value)} />
                                <span className="name" >Validate Path</span>
                            </label>
                        </div>
                    </div>
                    <div className="card" style={{height:'60%'}} >
                        { mode === 'solve' && (
                            <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'center', paddingTop:'7.5%', gap:'12.5%'}} >
                                <label htmlFor="method" style={{fontSize:'1.5em'}} >Solving Method</label>
                                <div  style={{display:'flex', flexDirection:'column', gap:'5%'}}>
                                    <div className="radio-inputs" style={{width:'85%', alignSelf:'center', display:'grid', position:'relative', gridTemplateColumns:'repeat(2, 1fr)', gap:'2.5%', boxSizing:'border-box'}} >
                                        <label className="radio">
                                            <input type="radio" value="righthand" checked={method === "righthand"} onChange={(e) => setMethod(e.target.value)} />
                                            <span className="name" style={{padding:'1rem'}} >Right Hand Rule</span>
                                        </label>
                                        <label className="radio">
                                            <input type="radio" value="tremaux" checked={method === "tremaux"} onChange={(e) => {setMethod(e.target.value); setMaze("tiny.maz.txt")}} />
                                            <span className="name" style={{padding:'1rem'}} >Tremaux</span>
                                        </label>
                                        <label className="radio">
                                            <input type="radio" value="bfs" checked={method === "bfs"} onChange={(e) => setMethod(e.target.value)} />
                                            <span className="name" style={{padding:'1rem'}} >BFS</span>
                                        </label>
                                        <label className="radio">
                                            <input type="radio" value="dfs" checked={method === "dfs"} onChange={(e) => setMethod(e.target.value)} />
                                            <span className="name" style={{padding:'1rem'}} >DFS</span>
                                        </label>
                                    </div>
                                    <div style={{height:'90%', width:'95%', display:'flex', justifyContent:'center', margin:'auto', textAlign:'center', fontSize:'16px', lineHeight:'1.5', lineBreak:'break-word', wordBreak:'normal', whiteSpace:'normal'}}>
                                        {methodDesc(method)}
                                    </div>
                                </div>
                            </div>
                        )}
                        { mode === 'validate' && (
                            <div style={{height:'35%', display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'center', paddingTop:'10%', gap:'15%'}} >
                                <label htmlFor="pathToVerify" style={{fontSize:'1.5em', paddingBottom:'2.5%'}} >Set of Movements</label>
                                <textarea className="text-area" id="pathToVerify" value={pathToVerify} onChange={(e) => setPathToVerify(e.target.value)} style={{width:'85%', height:'100%'}} />
                                <p style={{height:'90%', width:'90%', display:'flex', justifyContent:'center', textAlign:'center', fontSize:'14px', lineHeight:'1.5', lineBreak:'break-word', wordBreak:'normal', whiteSpace:'normal'}}>
                                    Input a set of movements that the runner can take: Forward - F | Right - R | Left - L. You can group consecutive movements of the same type together (eg. 3F = F F F)
                                </p>
                                <div className='path-input-controller' style={{width:'90%', display:'flex', justifyContent:'space-evenly', alignItems:'center'}}>
                                    <button className='secondary-button' type='button' onClick={() => addMovement('L')} >Left</button>
                                    <button className='secondary-button' type='button' onClick={() => addMovement('F')} >Forward</button>
                                    <button className='secondary-button' type='button' onClick={() => addMovement('R')} >Right</button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
                <div className="card" style={{width:'55%', display:'flex', flexDirection:'column', justifyContent:'flex-start', paddingTop:'2.5%'}} >
                    <div style={{width:'100%', display:'flex', justifyContent:'space-evenly'}}>
                        <label htmlFor="maze" style={{fontSize:'1.5em'}} >Maze</label>
                        <select className="menu-selector" id="maze" value={maze} onChange={(e) => setMaze(e.target.value)} style={{width:'50%', alignSelf:'start'}} >
                            <option value="tiny.maz.txt">Tiny</option>
                            <option value="small.maz.txt">Small</option>
                            <option value="rectangle.maz.txt">Rectangle</option>
                            <option value="medium.maz.txt">Large</option>
                            <option value="direct.maz.txt">Direct</option>
                            { (mode === 'validate' || method !== 'tremaux') && (
                                <option value="custom">Custom</option>
                            )}
                        </select>
                        { maze === 'custom' && (
                            <div className="steppers-container" style={{display:'flex', alignItems:'center', gap:'5%'}} >
                                <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}} >
                                    <label htmlFor="width-stepper" >Width</label>
                                    <input
                                        id="width-stepper"
                                        type="number"
                                        className="stepper"
                                        value={width}
                                        onChange={(e) => setWidth(parseInt(e.target.value))}
                                        min="3"
                                        max="52"
                                        step="1"
                                    />
                                </div>
                                <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}} >
                                    <label htmlFor="height-stepper" >Height</label>
                                    <input
                                        id="height-stepper"
                                        type="number"
                                        className="stepper"
                                        value={height}
                                        onChange={(e) => setHeight(parseInt(e.target.value))}
                                        min="3"
                                        max="27"
                                        step="1"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{width:'100%', height:'90%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        { (maze === 'custom' && (method !== 'tremaux' || mode === 'validate')) ? (
                            <CustomMaze />
                        ) : mazeArr ? (
                            <Maze maze={mazeArr} />
                        ) : (
                            <p>Loading maze...</p> // Display loading message while fetching
                        )}
                    </div>
                </div>
            </div>
            <div >
                <button className="main-button" type="submit" onClick={handleSubmit} >Submit</button>
            </div>
        </div>
    );
}

export default InitInfo;
