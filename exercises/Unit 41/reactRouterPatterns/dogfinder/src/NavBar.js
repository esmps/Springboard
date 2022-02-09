import { NavLink } from 'react-router-dom';

function NavBar({dogs}) {
  return (
    <nav className="NavBar">
        <NavLink exact to="/dogs">All Dogs</NavLink>
        {dogs.map(dog => (
            <NavLink key={dog.name} to={`/dogs/${dog.name.toLowerCase()}`}>
                {dog.name}
            </NavLink>
            )
        )}
    </nav>
  );
}

export default NavBar;