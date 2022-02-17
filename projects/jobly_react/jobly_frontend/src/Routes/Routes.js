import React from 'react';
import { Route, Switch } from "react-router-dom";
import CompanyCard from "../Components/CompanyCard";
import CompanyList from "./CompanyList";
import Jobs from "./Jobs";
import Job from "../Components/Job";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Profile from "./Profile";
import Home from "./Home";
import NotFound from "./NotFound";


function Routes() {
    return (
      <Switch>
        <Route path="/companies/:handle">
            <CompanyCard />
        </Route>
        <Route path="/companies">
            <CompanyList />
        </Route>
        <Route path="/jobs/:id">
            <Job />
        </Route>
        <Route exact path="/jobs">
            <Jobs />
        </Route>
        <Route exact path="/login">
            <LogIn />
        </Route>
        <Route exact path="/signup">
            <SignUp />
        </Route>
        <Route exact path="/profile">
            <Profile />
        </Route>
        <Route exact path="/">
            <Home />
        </Route>
        <Route>
            <NotFound />
        </Route>
      </Switch>
    );
  }

export default Routes;