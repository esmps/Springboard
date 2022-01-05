// Get jobs for all users and individual users

const { BadRequestError } = require("../expressError");
const db = require("../db");

// Get job ids for all users 
async function getJobsAll(users){
    for (let user in users){
        let jobs = await db.query(`SELECT job_id FROM applications WHERE username = $1`, [users[user].username]);
        const jobApps = jobs.rows;
        let jobIDs = [];
        for (let job in jobApps){
        jobIDs.push(jobApps[job].job_id);
        }
        users[user].jobs = jobIDs;
    }
    return users;
}
// Get job ids for one user 
async function getJobs(user){
    let jobs = await db.query(`SELECT job_id FROM applications WHERE username = $1`, [user.username]);
    const jobApps = jobs.rows;
    let jobIDs = [];
    for (let job in jobApps){
    jobIDs.push(jobApps[job].job_id);
    }
    user.jobs = jobIDs;
    return user;
}

module.exports = { getJobsAll, getJobs}