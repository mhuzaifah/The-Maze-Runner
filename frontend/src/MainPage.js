import React from "react";
import Spline from '@splinetool/react-spline';
import {Link} from "react-router-dom";

function MainPage() {
    return (
        <div className="mainPage-container">
            <div className="mainPage-component-1">
                <h1 className="mainPage-title">The Maze Runner</h1>
                <Link to="/init-info" className="main-button">Start Running!</Link>
            </div>
            <div className="mainPage-component-2">
                <Spline className="mainPage-cube" scene="https://prod.spline.design/MZ4wMYr4Y3ANyzgB/scene.splinecode" />
            </div>
        </div>
    );
}

export default MainPage;