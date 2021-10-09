import '../App.scss';
import React, { useState } from 'react';

function ViewTab(props) {
    var changeTab = () => {
        props.changeTabInput(props.title);
    }
    return (
        <div className={"view-tab " + props.active} onClick={changeTab}></div>
    );
}

export default ViewTab;
