import '../App.scss';
import React, { useState } from 'react';

function Welcome() {
    var [hidden, hide] = useState("");
    if (hidden === "")
        setTimeout(() => {
            if (hidden === "no-display")
                return
            hide("hidden")

            setTimeout(() => {
                hide("no-display")
            }, 2000)

        }, 3000)

    return (
        <><div className={"Welcome " + hidden} >
            <div className="welcome-logo"></div>
            <h1 className="welcome-text">WELCOME</h1>
            {/* <div className="privacy">Privacy Policy</div> */}
            <div className="social-links">software@etinaude.dev</div>
        </div >
        </>

    );
}

export default Welcome;
