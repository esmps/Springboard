"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/**************************************************************************************s
  Story: a single story in the system
***************************************************************************************/

class Story {

//<--Make instance of Story from data object ------------------------------------------->
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  //<--Parses hostname out of URL and returns it --------------------------------------->
  getHostName() {
    return new URL(this.url).hostname;;
  }
}

/**************************************************************************************
  List of Story instances: used by UI to show story lists in DOM.
***************************************************************************************/

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

    //<--Generate a new StoryList ----------------------------------------------------->
  static async getStories() {

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  //<--Create a new story and add to API --------------------------------------------->
  async addStory( user, newStory) {
    const {storyTitle: title, storyAuthor: author, storyURL: url} = newStory;
    //add story to API
    const res = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: { 
        token: user.loginToken,
        story: {title, author, url},
       },
    });
    //create story instance
    const story = new Story(res.data.story);
    //add story to list
    this.stories.unshift(story);
    //add story to users list
    user.ownStories.unshift(story);

    return story;
  }

  //<--Adding and removing myStories from API----------------------------------------->
  async removeStory(user, storyId){
    const token = user.loginToken;
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data: {token}
    });

    this.stories = this.stories.filter(element => element.storyId != storyId);
    
    user.ownStories = user.ownStories.filter(element => element.storyId != storyId);
  }

}

/************************************************************************************
  User: a user in the system (only used to represent the current user)
*************************************************************************************/

class User {

  //<--Make user instance from obj of user data and a token-------------------------->
  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  //<--Register new user in API, make User instance & return it.---------------------->
  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  //<--Login in user with API, make User instance & return it.------------------------>
  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  //<--Automatically login with stored user/pass-------------------------------------->
  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

//<--Adding and removing favorites from API------------------------------------------->
  //add favorite
  async addFavorite(story) {
    this.favorites.push(story);
    await this.addOrRemoveFav("add", story);
  }
  //remove favorite
  async removeFavorite(story) {
    this.favorites = this.favorites.filter(element => element.storyId != story.storyId );
    await this.addOrRemoveFav("remove", story);
}
  //add or remove favorite from API
  async addOrRemoveFav(action, story){
    const token = this.loginToken;
    const method = action === "add" ? "POST" : "DELETE";
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      data: {token},
    });
  }
  //checks if story is a user favorite
  isFavorite(story) {
    return this.favorites.some(element => (element.storyId === story.storyId));
  }
}