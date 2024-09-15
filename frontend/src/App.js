import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import InitInfo from "./InitInfo";
import MazeSolving from "./MazeSolving";
import {CustomMazeProvider} from "./CustomMazeContext";
import {MazeSolverInfoProvider} from "./MazeSolverInfoContext";
function App() {
  return (
      <Router>
          <div className="App">
              <MazeSolverInfoProvider>
              <CustomMazeProvider>
                  <Routes>
                      <Route path="/" element={<MainPage />} />
                      <Route path="/init-info" element={<InitInfo />} />
                      <Route path="/maze-solving" element={<MazeSolving />} />
                  </Routes>
              </CustomMazeProvider>
              </MazeSolverInfoProvider>
          </div>
      </Router>
  );
}

export default App;
