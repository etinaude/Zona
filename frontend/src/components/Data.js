import '../App.scss';
import React, { useState } from 'react';
import Table from './Chart';

function Data(props) {
    var changeTab = () => {
        props.changeTabInput(props.title);
    }


    return (
        <div className="center-container">
            <Table roomNumber={props.roomNumber} timeScale={props.timeScale} />
        </div>
    );
}

export default Data;
