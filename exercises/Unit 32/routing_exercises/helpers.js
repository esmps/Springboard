function findMedian(nums){
    console.log(`findMedian: ${nums}`)
    let median;
    if (nums.length % 2 === 0){
        let i1 = Math.floor(nums.length/2) - 1;
        let i2 = Math.floor(nums.length/2);
        console.log(i1, i2);
        median = (parseInt(nums[i1]) + parseInt(nums[i2])) / 2;
        console.log(median);
    }
    else{
        median = nums[Math.floor(nums.length/2)]
    }
    return median;
}
function findMean(nums){
    let sum = 0;
    for (let num in nums){
        sum = sum + parseInt(nums[num]);
    }
    const mean = sum/(nums.length);
    return mean;
}
function findMode(nums){
    const freq = getFrequency(nums);

    let count = 0;
    let mode;
    for (let key in freq) {
        if (freq[key] > count) {
            mode = key;
            count = freq[key];
        }
    };
    return parseInt(mode);
}

function getFrequency(arr) {
    let freq = {};
    for (let i = 0; i < arr.length ; i++) {
        let num = arr[i];
        if (freq[num]) {
           freq[num]++;
        } else {
           freq[num] = 1;
        }
    }
    return freq;
};

module.exports = {
    findMean,
    findMedian,
    findMode
};