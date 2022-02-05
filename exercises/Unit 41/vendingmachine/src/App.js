import {BrowserRouter, Route} from 'react-router-dom';
import './App.css';
import Home from './Home';
import Chips from './Chips';
import Candy from './Candy';
import Powerade from './Powerade';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/chips">
          <Chips />
        </Route>
        <Route exact path="/candy">
          <Candy />
        </Route>
        <Route exact path="/powerade">
          <Powerade />
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
