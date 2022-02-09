import { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import ListColors from './ListColors';
import NewColorForm from './NewColorForm';
import FilterColor from './FilterColor';

function Routes() {
    const [colors, setColors] = useState({
        red: "#FF0000",
        green: "#00FF00",
        blue: "#0000FF"
    });
    function handleAddColor(newColor){
        setColors(prevColors => ({...newColor, ...prevColors}));
    }

    return (
        <BrowserRouter>
        <Switch>
            <Route exact path="/colors">
                <ListColors colors={colors}/>
            </Route>
            <Route exact path="/colors/new">
                <NewColorForm addColor={handleAddColor} />
            </Route>
            <Route path="/colors/:color">
                <FilterColor colors={colors} />
            </Route>
            <Redirect to="/colors" />
        </Switch>
        </BrowserRouter>
    );
}

export default Routes;
