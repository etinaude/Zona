import './App.scss';
import React, { useState } from 'react';
// import Table from './components/Table';
import ViewTab from './components/ViewTab';
// import Graph from './components/Chart';

// import About from "./pages/About"
// import Locations from "./pages/Locations"
import Welcome from "./pages/Welcome"
import Live from "./components/Live"
import Data from "./components/Data"







function App() {
  var roomNumber = 0
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
        switchView(<Data roomNumber={roomNumber} />);
        break
      default:
    }
  }



  var changeRoom = (number) => {
    roomNumber = number;
    if (tab === "Live") {
      switchView(<Live roomNumber={roomNumber} />);
    } else {
      switchView(<Data roomNumber={roomNumber} />);
    }


    switchRooms(
      <>
        <div onClick={() => changeRoom(0)} className={number === 0 ? "active" : "no-active"}></div>
        <div onClick={() => changeRoom(1)} className={number === 1 ? "active" : "no-active"}></div>
        <div onClick={() => changeRoom(2)} className={number === 2 ? "active" : "no-active"}></div>
        <div onClick={() => changeRoom(3)} className={number === 3 ? "active" : "no-active"}></div>
      </>)
  }



  var [rooms, switchRooms] = useState(
    <>
      <div onClick={() => changeRoom(0)} className="active"></div>
      <div onClick={() => changeRoom(1)} className="no-active"></div>
      <div onClick={() => changeRoom(2)} className="no-active"></div>
      <div onClick={() => changeRoom(3)} className="no-active"></div>
    </>);
  var [viewElement, switchView] = useState(<Live roomNumber="6" />);
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
          {viewTab}
        </div>
        <div className="room-area">
          {viewElement}
        </div>
        <div className="room-tab">
          {rooms}
        </div>

      </div>

    </div >
  );
}









export default App;
