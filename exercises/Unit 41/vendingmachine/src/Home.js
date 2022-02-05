import { NavLink } from "react-router-dom";

function Home(){
    return (
        <>
            <h1>Vending Machine</h1>
            <p>What would you like?</p>
            <NavLink exact to='/chips'>Chips</NavLink>
            <br/>
            <NavLink exact to='/candy'>Candy</NavLink>
            <br/>
            <NavLink exact to='/powerade'>Powerade</NavLink>
        </>
    )
}

export default Home;