import React from 'react';
import { Route, Switch } from "react-router-dom";
import Company from "./Company";
import CompanyList from "./CompanyList";
import JobList from "./JobList";
import LogInForm from "../Components/LogInForm";
import SignUpForm from "../Components/SignUpForm";
import Profile from "./Profile";
import Homepage from "./Homepage";
import NotFound from "./NotFound";


function Routes({login, signup}) {
    return (
      <Switch>
        <Route path="/companies/:handle">
            <Company />
        </Route>
        <Route path="/companies">
            <CompanyList />
        </Route>
        <Route exact path="/jobs">
            <JobList />
        </Route>
        <Route exact path="/login">
            <LogInForm login={login}/>
        </Route>
        <Route exact path="/signup">
            <SignUpForm signup={signup}/>
        </Route>
        <Route exact path="/profile">
            <Profile />
        </Route>
        <Route exact path="/">
            <Homepage />
        </Route>
        <Route>
            <NotFound />
        </Route>
      </Switch>
    );
  }

export default Routes;