const fs = require('fs');

function cat(path){
    fs.readFile(path, 'utf8', function(err, data){
        if (err){
            console.log(`Error reading ${path}:\n${err}`);
            process.exit(1);
        }
        console.log(data);
    });
};

const argv = process.argv;

for (let i = 2; i < argv.length; i++){
    cat(argv[i]);
};