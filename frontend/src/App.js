import './App.css';
import React from 'react';
import Table from './components/Table';
import Graph from './components/Chart';
import Nav from './components/Nav';
import About from "./pages/About"



function App() {

  return (
    <div>
      <Nav></Nav>
      <About></About>
      {/* <Table></Table> */}
      {/* <Graph></Graph> */}
    </div>
  );
}






export default App;
