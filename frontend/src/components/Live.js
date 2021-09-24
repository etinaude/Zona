import '../App.scss';
import React, { useState } from 'react';





function Live(props) {
    return (
        <div className="Live">
            <div className="render">

            </div>
            <div className="live-count-container">
                <div className="live-count-number">
                    {props.roomNumber}
                </div>
                <div className="live-count-text">People In the room</div>
            </div>

        </div >
    );
}









export default Live;
