"use strict";

/* This is the global list of the stories, an instance of StoryList */
let storyList;

//<--Show stories on page load ---------------------------------------------------->
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

//<--Create HTML for new stories ------------------------------------------------->
function generateStoryMarkup(story, deleteIcon = false) {
  const showStar = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${deleteIcon ? getDelete() : ""}
        ${showStar ? getStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
//create HTML for favorite icon
function getStar(story, user){
  const isFav = user.isFavorite(story);
  const starType = isFav ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>`;
}
//create HTML for trash icon
function getDelete(){
  return `
    <span class="trash">
      <i class="fa fa-trash"></i>
    </span>`;
}

//<--Submit new stories ---------------------------------------------------------->
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();
  const data = getNewStoryData();
  let newStory = null;
    try{
      newStory = await storyList.addStory(currentUser, data);
      $allStoriesList.prepend(generateStoryMarkup(newStory));
      $storyForm.hide();
    }
    catch(err){
      setTimeout(() => {
        $("#story-error").hide();
      }, 3000)
      $("#story-error").show();
    }
  }

//get and return new story data
function getNewStoryData(){
  const storyTitle = $("#story-title").val();
  const storyAuthor = $("#story-author").val();
  const storyURL = $("#story-url").val();
  return {storyTitle, storyAuthor, storyURL};
}

$storyForm.on("submit", submitNewStory);

//<--Put stories on page--------------------------------------------------------->
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//<--Put favorite stories on page------------------------------------------------>
function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0){
    $favoritedStories.append(`<i class="no-stories">No favorites yet!</i>`);
  }
  else{
    for (let story of currentUser.favorites){
      $favoritedStories.append(generateStoryMarkup(story));
    }
  }

  $favoritedStories.show();
}

//<--Toggle Favorite Stories---------------------------------------------------->
async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(element => element.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($target.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesList.on("click", ".star", toggleStoryFavorite);

//<--Put my stories on page --------------------------------------------------->
function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $myStories.empty();

  if(currentUser.ownStories.length == 0){
    $myStories.append(`<i class="no-stories">No stories yet!</i>`);
  }
  else{
    for (let story of currentUser.ownStories){
      $myStories.append(generateStoryMarkup(story, true));
    }
  }
  $myStories.show();
}

//<--Put my stories on page --------------------------------------------------->
function putMyProfileOnPage() {
  console.debug("putProfileOnPage");

  $myProfile.empty();
  $myProfile.append(generateProfile(currentUser));
  $myProfile.show();
}
//create profile HTML components
function generateProfile(user){
  return `
    <li><b>Name:</b> ${user.name}</li>
    <li><b>Username:</b> ${user.username}</li>
    <li><b>Account Created:</b> ${user.createdAt.substring(0, 10)}</li>
  `
}

//<--Handle click on trashcan to delete my stories --------------------------->
async function clickOnDeleteStory(evt) {
  console.debug("clickOnDeleteStory");

  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);
  putMyStoriesOnPage();
}

$myStories.on("click", ".trash", clickOnDeleteStory);