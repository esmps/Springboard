"use strict";

/*******************************************************************************
  Handling navbar clicks and updating navbar
********************************************************************************/

//<--Handle click on site name ------------------------------------------------->

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  $storyForm.hide();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

//<--Handle click on login link ------------------------------------------------->

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

//<--Update navbar to show user is logged in ------------------------------------>

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//<--Handle click on Submit link ------------------------------------------------>

function navSubmitClick(evt){
  console.debug("navSubmitClick");
  hidePageComponents();
  $("#story-form").show();
  putStoriesOnPage();
}

$body.on("click", "#nav-submit-story", navSubmitClick);

//<--Handle click on "my favorites" --------------------------------------------->
function navMyFavoriteStories(evt){
  console.debug("navMyFavoriteStories", evt);
  hidePageComponents();
  putFavStoriesOnPage();
}

$body.on("click", "#nav-my-favorites", navMyFavoriteStories);

//<--Handle click on "my stories" ------------------------------------------------>
function navMyStories(evt){
  console.debug("navMyFavoriteStories", evt);
  hidePageComponents();
  putMyStoriesOnPage();
}

$body.on("click", "#nav-my-stories", navMyStories);


//<--Handle click on trash icon ------------------------------------------------->
function navMyStories(evt){
  console.debug("navMyFavoriteStories", evt);
  hidePageComponents();
  putMyStoriesOnPage();
}

$body.on("click", "#nav-my-stories", navMyStories);

//<--Handle click on username --------------------------------------------------->
function navMyProfile(evt){
  console.debug("navMyProfile", evt);
  hidePageComponents();
  putMyProfileOnPage();
}
$body.on("click", "#nav-user-profile", navMyProfile)