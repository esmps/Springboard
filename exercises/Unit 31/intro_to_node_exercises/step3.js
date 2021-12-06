const fs = require('fs');
const process = require('process');
const axios = require('axios');

function handleOutput(text, output){
    if (output){
        fs.writeFile(output, text, "utf8", function(err){
            if (err){
                console.log(`Couldn't write to ${output}: ${err}`);
                process.exit(1);
            }
        });
    }
    else{
        console.log(text);
    };
};


function cat(path, output){
    fs.readFile(path, 'utf8', function(err, data){
        if (err){
            console.log(`Error reading ${path}:\n${err}`);
            process.exit(1);
        }
        handleOutput(data, output);
    });
};

async function webCat(URL, output){
    try{
        let res = await axios.get(URL);
        handleOutput(res.data, output);
    }catch(err){
        console.log(`Error getting ${URL}:\n${err}`);
        process.exit(1);
    }
}


let path;
let output;

if (process.argv[2] === '--out'){
    path = process.argv[3];
    output = process.argv[4];
}
else {
    path = process.argv[2];
}

if (path.slice(0,4) === 'http'){
    webCat(path, output);
}
else{
    cat(path, output);   
}
