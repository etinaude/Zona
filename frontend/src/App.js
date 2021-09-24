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

  var [viewElement, switchView] = useState(<Live />);
  var [viewTab, switchViewTab] = useState(
    <><ViewTab active="active" title="Live" changeTabInput={changeTab} />
      <ViewTab active="no-active" title="Data" changeTabInput={changeTab} />
    </>);


  return (
    <div className="app">
      <div className="background"></div>
      <Welcome />
      <div className="template">
        <div className="view-tabs">
          {viewTab}
        </div>
        <div className="room-area">
          {viewElement}
        </div>
        <div className="room-tab">
          <div className="active"></div>
          <div className="no-active"></div>
          <div className="no-active"></div>
          <div className="no-active"></div>
        </div>

      </div>

    </div >
  );
}









export default App;
