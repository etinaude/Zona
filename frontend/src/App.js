import './App.css';
import React, { useState } from 'react';
import Table from './components/Table';
import Graph from './components/Chart';
import Nav from './components/Nav';
import About from "./pages/About"
import Locations from "./pages/Locations"
import Welcome from "./pages/Welcome"





function App() {
  var [tabElement, switchTab] = useState(<About></About>);

  var changeTab = (newTab) => {
    switch (newTab) {
      case "About":
        switchTab(<About></About>)
        break
      case "Locations":
        switchTab(<Locations></Locations>)
        break

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
        <div className="room-area"></div>
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
