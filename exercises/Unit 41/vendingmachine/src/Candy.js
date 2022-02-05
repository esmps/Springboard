import { NavLink } from "react-router-dom";

function Candy() {
    return (
        <div className="Candy">
            <p>Here is your candy!</p>
            <NavLink exact to="/">Home</NavLink>
        </div>
    )
}

export default Candy;