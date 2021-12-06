const fs = require('fs');
const process = require('process');
const axios = require('axios');

function cat(path){
    fs.readFile(path, 'utf8', function(err, data){
        if (err){
            console.log(`Error reading ${path}:\n${err}`);
            process.exit(1);
        }
        console.log(data);
    });
};

async function webCat(URL){
    try{
        let res = await axios.get(URL);
        console.log(res.data);
    }catch(err){
        console.log(`Error getting ${URL}:\n${err}`);
        process.exit(1);
    }
}

const argv = process.argv;
for (let i = 2; i < argv.length; i++){
    if (argv[i].slice(0,4) === 'http'){
        webCat(argv[i]);
    }
    else{
        cat(argv[i]);   
    }
};