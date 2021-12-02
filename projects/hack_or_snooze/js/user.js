"use strict";

/*****************************************************************
  User login/signup
******************************************************************/

/* Global to hold the User instance of the currently-logged-in user */
let currentUser;

//<--Handle login form submission. If login ok, sets up the user instance -------->

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  try{
    currentUser = await User.login(username, password);
    $loginForm.trigger("reset");
    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
  }catch(err){
    setTimeout(() => {
      $("#login-error").hide();
    }, 3000)
    $("#login-error").show();
  }
  
}
$loginForm.on("submit", login);

//<--Handle signup form submission ------------------------------------------------>

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

//<--Handle click of logout button ------------------------------------------------>

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

//<--Storing/recalling previously-logged-in-user with localStorage----------------->

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

//<--Sync current user information to localStorage.-------------------------------->

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

//<--General UI stuff about users.------------------------------------------------->

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  hidePageComponents();
  putStoriesOnPage();
  $allStoriesList.show();
  updateNavOnLogin();
}
