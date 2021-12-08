const express = require('express');
const ExpressError = require("./expressError")
const { findMean, findMedian, findMode } = require('./helpers');

const app = express();
app.use(express.json());

let nums;

app.use(function(req, res, next){
    nums = [];
    if (req.query.nums){
        res = req.query.nums.split(",");
        for (let i = 0; i < res.length; i++){
            let convNum = Number(res[i]);
            if (Number.isNaN(convNum)){
                throw new Error(`Value ${res[i]} at index ${i} is not a valid number.`);
            }
            nums.push(convNum);
        }
        nums.sort(function(a, b){return a-b});
        next();
    }
    else{
        throw new ExpressError('You must pass a query key of nums with a comma-separated list of numbers. i.e. median?nums=1,2,3', 400)
    }
});

app.get('/mean', function(req, res){
    return res.send({
        operation: "mean",
        value: findMean(nums)
    });
});

app.get('/median', function(req, res){
    return res.send({
        operation: "median",
        value: findMedian(nums)
    });
});

app.get('/mode', function(req, res){
    return res.send({
        operation: "mode",
        value: findMode(nums)
    });   
});

app.listen(3000, function () {
  console.log('App on port 3000');
})