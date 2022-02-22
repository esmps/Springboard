import React, { useState, useEffect,useContext } from "react";
import { Redirect } from 'react-router-dom';
import JoblyApi from '../Helpers/api';
import JobsSearchForm from '../Components/JobsSearchForm';
import JobCard from "../Components/JobCard";
import CurrUserContext from '../Context/CurrUserContext';
import "../Styles/Loading.css";


function Jobs() {
  const {currUser} = useContext(CurrUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setCompanies] = useState([]);
  const [queries, setQueries] = useState("");

  useEffect(() => {
    async function getJobs() {
      let jobs = await JoblyApi.getJobs(queries);
      setCompanies(jobs);
      setIsLoading(false);
    }
    getJobs();
  }, [queries]);

  if (isLoading) {
    return <p className="loading">Loading &hellip;</p>;
  }

  const jobsList = jobs.map(job => (
    <JobCard
      key={job.id}
      id={job.id}
      title={job.title}
      salary={job.salary}
      equity={job.equity}
      companyName={job.companyName}
      companyHandle={job.companyHandle}
    />
  ))
  

  return (
    <>
      {
        currUser ? 
        <>
            <div className="CompanyList col-md-8 offset-md-2">
              <JobsSearchForm setQueries={setQueries}/>
              {jobsList}
            </div>
        </>
        :
        <Redirect to="/"></Redirect>
      }
    </>
  );
}

  export default Jobs;