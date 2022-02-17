import React from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import Routes from './Routes/Routes';
import NavBar from './Components/NavBar';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <main>
          <Routes />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
