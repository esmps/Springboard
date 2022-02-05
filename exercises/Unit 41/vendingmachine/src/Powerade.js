import { NavLink } from "react-router-dom";

function Powerade() {
    return (
        <div className="Powerade">
            <p>Here is your drink!</p>
            <NavLink exact to="/">Home</NavLink>
        </div>
    )
}

export default Powerade;