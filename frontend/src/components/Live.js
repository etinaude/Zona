import '../App.scss';
import React, { useState } from 'react';





function Live(props) {
    return (
        <div className="Live">
            <div className="live-count-container">
                <div className="name">
                    {props.roomName}
                </div>
                <div className="live-count-number">
                    {parseInt(props.roomNumber) + 2}
                    <div className="live-count-text">people in the room</div>
                </div>
            </div>
            <div className={"render room" + props.roomNumber}></div>

        </div >
    );
}

export default Live;
