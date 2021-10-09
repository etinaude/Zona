import '../App.scss';
import React, { useState } from 'react';





function Live(props) {
    return (
        <div className="Live">
            <div className={"render room" + props.roomNumber}>

            </div>
            <div className="live-count-container">
                <div className="name">
                    {props.roomName}
                </div>
                <div className="live-count-number">
                    {props.roomNumber}
                    <div className="live-count-text">People In the room</div>
                </div>
            </div>

        </div >
    );
}

export default Live;
