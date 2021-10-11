import './App.scss';
import React, { useState } from 'react';
import ViewTab from './components/ViewTab';
import Table from './components/Chart';

import Welcome from "./pages/Welcome"
import Live from "./components/Live"

function App() {
  var roomNumber = 1
  var roomName = "Scrum 1"

  var tab = "Live"



  var changeTab = (newTab) => {
    switch (newTab) {
      case "Live":
        tab = "Live"
        switchView(<Live roomNumber={roomNumber} roomName={roomName} />);

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
    if (roomNumber === 1) {
      roomName = "Digi Lab"
    } else if (roomNumber === 2) {
      roomName = "Studio 1"
    } else if (roomNumber === 3) {
      roomName = "Studio 2"
    }
    else if (roomNumber === 4) {
      roomName = "Cabaret"
    }
    else if (roomNumber === 5) {
      roomName = "Scrum Room 1"
    }
    else if (roomNumber === 6) {
      roomName = "Scrum Room 2"
    }
    switchView(<></>);

    if (tab === "Live") {
      switchView(<Live roomNumber={number} roomName={roomName} />);
    } else {
      switchView(<Table roomNumber={number} />);
    }

    switchRooms(
      <>
        <div onClick={() => changeRoom(1)} className={number === 1 ? "active view-tab" : "no-active view-tab"}>Digi Lab</div>
        <div onClick={() => changeRoom(2)} className={number === 2 ? "active view-tab" : "no-active view-tab"}>Studio 1</div>
        <div onClick={() => changeRoom(3)} className={number === 3 ? "active view-tab" : "no-active view-tab"}>Studio 2</div>
        <div onClick={() => changeRoom(4)} className={number === 4 ? "active view-tab" : "no-active view-tab"}>Cabaret</div>
        <div onClick={() => changeRoom(5)} className={number === 5 ? "active view-tab" : "no-active view-tab"}>Scrum 1</div>
        <div onClick={() => changeRoom(6)} className={number === 6 ? "active view-tab" : "no-active view-tab"}>Scrum 2</div>

      </>)
  }



  var [rooms, switchRooms] = useState(
    <>
      <div onClick={() => changeRoom(1)} className="active view-tab">Digi Lab</div>
      <div onClick={() => changeRoom(2)} className="no-active view-tab">Studio 1</div>
      <div onClick={() => changeRoom(3)} className="no-active view-tab">Studio 2</div>
      <div onClick={() => changeRoom(4)} className="no-active view-tab">Cabaret</div>
      <div onClick={() => changeRoom(5)} className="no-active view-tab">Scrum 1</div>
      <div onClick={() => changeRoom(6)} className="no-active view-tab">Scrum 2</div>
    </>);
  var [viewElement, switchView] = useState(<Live roomNumber="1" roomName={roomName} />);
  var [viewTab, switchViewTab] = useState(
    <><ViewTab active="active" title="Live" changeTabInput={changeTab} />
      <ViewTab active="no-active" title="Data" changeTabInput={changeTab} />
    </>);


  return (
    <div className="app">
      <div className='logo'>
      </div>
      <div className="background"></div>
      <Welcome />
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
      <div className="privacy">Privacy Policy</div>

    </div >
  );
}

export default App;
