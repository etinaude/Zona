import './App.css';
import React from 'react';
import Table from './components/Table';
import Graph from './components/Chart';
import Nav from './components/Nav';
import About from "./pages/About"
import Locations from "./pages/Locations"




function App() {

  return (
    <div>
      <Nav></Nav>
      <Locations></Locations>
      {/* <About></About> */}
      {/* <Table></Table> */}
      {/* <Graph></Graph> */}
    </div>
  );
}






export default App;
