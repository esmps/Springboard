// Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number. 
// (Make sure you get back JSON by including the json query key, specific to this API.

const url = "http://numbersapi.com/25?json";

async function favNum(){
    const res =  await axios.get(url);
    console.log(res.data.text);
};
favNum();

// Figure out how to get data on multiple numbers in a single request. 
// Make that request and when you get the data back, put all of the number facts on the page.

const multURL = "http://numbersapi.com/13..19";

async function multNums() {
    const res = await axios.get(multURL);
    for (const num in res.data){
        $("#multNums").append(`<li>${res.data[num]}</li>`)
    };
};
multNums();

// Use the API to get 4 facts on your favorite number. 
// Once you have them all, put them on the page. It’s okay if some of the facts are repeats.

async function fourFacts(){
    for(let i=0; i < 4; i++){
        const res = await axios.get(url);
        $("#fourFacts").append(`<li>${res.data.text}</li>`);
    };
};
fourFacts();