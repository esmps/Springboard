import React from 'react';
import { Route, Switch } from "react-router-dom";
import Company from "./Company";
import Companies from "./Companies";
import Jobs from "./Jobs";
import Job from "./Job";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Profile from "./Profile";
import Home from "./Home";
import NotFound from "./NotFound";


function Routes() {
    return (
      <Switch>
        <Route path="/companies/:handle">
            <Company />
        </Route>
        <Route path="/companies">
            <Companies />
        </Route>
        <Route path="/jobs/:id">
            <Job />
        </Route>
        <Route path="/jobs">
            <Jobs />
        </Route>
        <Route path="/login">
            <LogIn />
        </Route>
        <Route path="/signup">
            <SignUp />
        </Route>
        <Route path="/profile">
            <Profile />
        </Route>
        <Route path="/">
            <Home />
        </Route>
        <Route>
            <NotFound />
        </Route>
      </Switch>
    );
  }

export default Routes;