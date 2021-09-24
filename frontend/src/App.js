import './App.scss';
import React, { useState } from 'react';
import Table from './components/Table';
import Graph from './components/Chart';
import Nav from './components/Nav';
import About from "./pages/About"
import Locations from "./pages/Locations"
import Welcome from "./pages/Welcome"
import Live from "./components/Live"







function App() {
  var changeTab = (newTab) => {

    switch (newTab) {
      case "Live":
        switchView(<Live />);

        switchViewTab(<><ViewTab active="active" title="Live" changeTabInput={changeTab} />
          <ViewTab active="no-active" title="Data" changeTabInput={changeTab} />
        </>)
        break
      case "Data":
        switchViewTab(<><ViewTab active="no-active" title="Live" changeTabInput={changeTab} />
          <ViewTab active="active" title="Data" changeTabInput={changeTab} />
        </>)
        switchView(<Data />);
        break
      default:
    }
  }



  return (
    <div className="app">
      <div className="background"></div>
      <Welcome />
      <div className="template">
        <div className="tabs">
          <div className="active">Live</div>
          <div className="no-active">Data</div>

        </div>
        <div className="room-area">
          <Live />
        </div>
        <div className="room-tab">
          <div className="active"></div>
          <div className="no-active"></div>
          <div className="no-active"></div>
          <div className="no-active"></div>
        </div>

      </div>
      {/* <Nav changeTab={changeTab} ></Nav> */}
      {/* <Locations></Locations> */}
      {/* {tabElement} */}
      {/* <About></About> */}
      {/* <Table></Table> */}
      {/* <Graph></Graph> */}
    </div >
  );
}









export default App;
