import { NavLink } from "react-router-dom";
import './Chips.css'

function Chips() {
    return (
        <div className="Chips">
            <p>Here are your chips!</p>
            <NavLink exact to="/">Home</NavLink>
        </div>
    )
}

export default Chips;