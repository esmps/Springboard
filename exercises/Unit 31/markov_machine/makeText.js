/** Command-line tool to generate Markov text. */
const fs = require("fs");
const markov = require("./markov");
const axios = require("axios");
const process = require("process");

function genMarkovText(text){
    const mm = new markov.MarkovMachine(text);
    console.log(mm.makeText());
}

function fileText(path){
    fs.readFile(path, 'utf8', function(err, data){
        if (err){
            console.log(`Error reading ${path}:\n${err}`);
            process.exit(1);
        }
        genMarkovText(data);
    });
}

async function urlText(URL){
    try{
        let res = await axios.get(URL);
        genMarkovText(res.data);
    }catch(err){
        console.log(`Error getting ${URL}:\n${err}`);
        process.exit(1);
    }
}

const src = process.argv[2].toLowerCase();
const path = process.argv[3];

if (src === 'file'){
    fileText(path);
}
else if (src === 'url'){
    urlText(path);
}
else {
    console.error(`Invalid source type: ${src}`);
    process.exit(1);
}