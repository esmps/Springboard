// Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number. 
// (Make sure you get back JSON by including the json query key, specific to this API.

const url = "http://numbersapi.com/25?json";

const favNum = axios.get(url);

favNum
    .then(data => console.log(data.data.text))
    .catch(err => console.log(err))

// Figure out how to get data on multiple numbers in a single request. 
// Make that request and when you get the data back, put all of the number facts on the page.

const multURL = "http://numbersapi.com/13..19";

const multNums = axios.get(multURL);

multNums
    .then(data => {
        for (const num in data.data){
            $("#multNums").append(`<li>${data.data[num]}</li>`)
        }
    })
    .catch(err => console.log(err))

// Use the API to get 4 facts on your favorite number. 
// Once you have them all, put them on the page. It’s okay if some of the facts are repeats.

const fourFacts = axios.get(url);

fourFacts
    .then(data => {
        $("#fourFacts1").append(`<li>${data.data.text}</li>`)
        return axios.get(url)
    })
    .then(data => {
        $("#fourFacts1").append(`<li>${data.data.text}</li>`)
        return axios.get(url)
    })
    .then(data => {
        $("#fourFacts1").append(`<li>${data.data.text}</li>`)
        return axios.get(url)
    })
    .then(data => {
        $("#fourFacts1").append(`<li>${data.data.text}</li>`)
        return axios.get(url)
    })
    .catch(err => console.log(err));


// Second way to do it with Promise.all
let fourFactsArr = [];

for (let i=1; i < 5; i++){
    fourFactsArr.push(axios.get(url));
}
Promise.all(fourFactsArr)
    .then(fourFactsArr => {
        fourFactsArr.forEach(fact => {
            $("#fourFacts2").append(`<li>${fact.data.text}</li>`)
        })
    })
    .catch(err => console.log(err))

