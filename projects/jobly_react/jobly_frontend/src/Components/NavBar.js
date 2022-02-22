import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import CurrUserContext from "../Context/CurrUserContext";
import "../Styles/NavBar.css";

function NavBar({ logout }) {
  const {currUser} = useContext(CurrUserContext);

  return (
      <div>
        <Navbar expand="md">
          <NavLink exact to="/" className="navbar-brand">
            Jobly
          </NavLink>
          <Nav className="ml-auto" navbar>
                {
                  currUser ? 
                  <>
                  <NavItem>
                    <NavLink to="/companies">Companies</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/jobs">Jobs</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/profile">Profile</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/" onClick={logout}>
                      Log out {currUser.username}
                    </NavLink>
                  </NavItem>
                  </>
                  :
                  <>
                  <NavItem>
                  <NavLink to="/login">Log In</NavLink>
                  </NavItem>
                  <NavItem>
                  <NavLink to="/signup">Sign Up</NavLink>
                  </NavItem>
                  </>
                }
          </Nav>
        </Navbar>
      </div>
  );
}

export default NavBar;