const { findMean, findMedian, findMode } = require('./helpers');

describe("find Median", function(){
    test("find median of odd set", function(){
        expect(findMedian([1,2,3,4,5,6,7,8,9])).toBe(5);
    });
    test("find median of even set", function(){
        expect(findMedian([1,2,3,4,5,6,7,8,9,10])).toBe(5.5);
    });
})

describe("find Mean", function(){
    test("find mean of set", function(){
        expect(findMean([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(5);
    });
})

describe("find Mode", function(){
    test("find mode of set", function(){
        expect(findMode([1,2,1,2,1,2,3,3,3,3,3,3,3,3])).toBe(3);
    });
})