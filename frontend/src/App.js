import './App.scss';
import React, { useState } from 'react';
import ViewTab from './components/ViewTab';
import Table from './components/Chart';

import Welcome from "./pages/Welcome"
import Live from "./components/Live"

function App() {
  var roomNumber = 1
  var tab = "Live"



  var changeTab = (newTab) => {
    switch (newTab) {
      case "Live":
        tab = "Live"
        switchView(<Live roomNumber={roomNumber} />);

        switchViewTab(<><ViewTab active="active" title="Live" changeTabInput={changeTab} />
          <ViewTab active="no-active" title="Data" changeTabInput={changeTab} />
        </>)
        break
      case "Data":
        tab = "Data"

        switchViewTab(<><ViewTab active="no-active" title="Live" changeTabInput={changeTab} />
          <ViewTab active="active" title="Data" changeTabInput={changeTab} />
        </>)
        switchView(<Table roomNumber={roomNumber} />);
        break
      default:
    }
  }



  var changeRoom = (number) => {
    roomNumber = number;
    switchView(<></>);

    if (tab === "Live") {
      switchView(<Live roomNumber={number} />);
    } else {
      switchView(<Table roomNumber={number} />);
    }

    switchRooms(
      <>
        <div onClick={() => changeRoom(1)} className={number === 1 ? "active view-tab" : "no-active view-tab"}>Fab Lab</div>
        <div onClick={() => changeRoom(2)} className={number === 2 ? "active view-tab" : "no-active view-tab"}>Digi Lab</div>
        <div onClick={() => changeRoom(3)} className={number === 3 ? "active view-tab" : "no-active view-tab"}>Cabaret</div>
      </>)
  }



  var [rooms, switchRooms] = useState(
    <>
      <div onClick={() => changeRoom(1)} className="active view-tab">Fab Lab</div>
      <div onClick={() => changeRoom(2)} className="no-active view-tab">Digi Lab</div>
      <div onClick={() => changeRoom(3)} className="no-active view-tab">Cabaret</div>
    </>);
  var [viewElement, switchView] = useState(<Live roomNumber="1" />);
  var [viewTab, switchViewTab] = useState(
    <><ViewTab active="active" title="Live" changeTabInput={changeTab} />
      <ViewTab active="no-active" title="Data" changeTabInput={changeTab} />
    </>);


  return (
    <div className="app">
      <div className="background"></div>
      {/* <Welcome /> */}
      <div className="template">
        <div className="view-tabs">
          {rooms}
        </div>
        <div className="room-area">
          {viewElement}
        </div>
        <div className="room-tab">
          {viewTab}
        </div>

      </div>

    </div >
  );
}

export default App;
