import React, { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import Routes from './Routes/Routes';
import NavBar from './Components/NavBar';
import CurrUserContext from "./Context/CurrUserContext";
import JoblyApi from './Helpers/api';
import jwt from "jsonwebtoken";
import "./Styles/Loading.css";
import './App.css';
import useLocalStorage from './Hooks/useLocalStorage';

//Key for storing token in localStorage
export const TOKEN_STORAGE_ID = "jobly-token";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currUser, setCurrUser] = useState(null);
  const [userApplicationIDs, setUserApplicationIDs] = useState(new Set([]));
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(function loadUserInfo() {
    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          JoblyApi.token = token;
          let currentUser = await JoblyApi.getUserInfo(username);
          setCurrUser(currentUser);
          setUserApplicationIDs(new Set(currentUser.applications));
        } catch (err) {
          setCurrUser(null);
        }
      }
      setIsLoading(false);
    }
    setIsLoading(true);
    getCurrentUser();
    console.log(currUser);
  }, [token]);

  /** Signs user up, logs in automatically and sets token */
  async function signup(signupData) {
    try {
      let token = await JoblyApi.signUp(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /** Logs user in and sets token */
  async function login(loginData) {
    try {
      let token = await JoblyApi.logIn(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  /** Logs user out */
  function logout() {
    setCurrUser(null);
    setToken(null);
  }

  /** Checks if a job has been applied for. */
  function hasAppliedToJob(id) {
    return userApplicationIDs.has(id);
  }
  /** Apply to a job: make API call and update set of application IDs. */
  function applyToJob(id) {
    if (hasAppliedToJob(id)) return;
    JoblyApi.applyToJob(currUser.username, id);
    setUserApplicationIDs(new Set([...userApplicationIDs, id]));
  }

  if (isLoading) {
    return <p className="loading">Loading &hellip;</p>;
  }

  return (
    <>
      <BrowserRouter>
        <CurrUserContext.Provider value={{currUser, setCurrUser, hasAppliedToJob, applyToJob}}>
          <NavBar logout={logout}/>
          <main>
            <Routes login={login} signup={signup}/>
          </main>
        </CurrUserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
