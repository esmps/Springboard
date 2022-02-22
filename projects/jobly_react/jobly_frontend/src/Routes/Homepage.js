import React, { useContext } from 'react';
import { Button } from 'reactstrap';
import CurrUserContext from '../Context/CurrUserContext';
import "../Styles/Homepage.css";

function Homepage() {
    const {currUser} = useContext(CurrUserContext);

    return (
        <div className="Homepage">
            <div className="Homepage-info">
            {
                currUser ?
                <>
                    <h1>Jobly</h1>
                    <h5><i>All the jobs in one, convenient place.</i></h5>
                    <h2>Welcome back, <b>{currUser.username}</b>!</h2>
                </>
                :
                <>
                    <h1>Jobly</h1>
                    <h3>All the jobs in one, convenient place.</h3>
                    <Button><a href="/login">Log In</a></Button><Button><a href="/signup">Sign Up</a></Button>
                </>
            }
            </div>
        </div>
    )
}

export default Homepage;