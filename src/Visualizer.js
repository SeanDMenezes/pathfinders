import React, { useEffect } from "react";
import Grid from "./components/grid/grid";
import Options from "./components/options/options";

// redux
import { connect } from "react-redux";
import { setNumRows, setNumCols } from "./redux/block/block-actions";

import "./Visualizer.scss";

const BOX_SIZE = 20;

const Visualizer = ({ setNumRows, setNumCols }) => {
    
    // calculate number of rows and columns
    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        setNumRows(Math.max(
            Math.floor((height - 400) / BOX_SIZE),
            10
        ));
        setNumCols(Math.max(
            Math.floor((width - 580) / BOX_SIZE),
            0
        ));
    }

    useEffect(() => {
        getWindowDimensions();
    });

    return (
        <div className="container">
            <Options />
            <Grid />
        </div>
    )
}
const mapDispatch = dispatch => ({
    setNumRows: numRows => dispatch(setNumRows(numRows)),
    setNumCols: numCols => dispatch(setNumCols(numCols))
});

export default connect(null, mapDispatch)(Visualizer);