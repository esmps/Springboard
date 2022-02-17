import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle} from 'reactstrap';
import JoblyApi from '../Helpers/api';
// import "../Styles/Company.css";
import JobCard from '../Components/JobCard';

function Company() {
    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState({});
    const [jobs, setJobs] = useState([]);
    const { handle } = useParams();

    useEffect(() => {
        async function getCompany() {
            let company = await JoblyApi.getCompany(handle);
            setCompany(company);
            setJobs(company.jobs)
            setIsLoading(false);
        }
        getCompany();
        }, []);

    if (isLoading) {
        return <p>Loading &hellip;</p>;
        }
    
    const jobsList = jobs.map(job => (
        <JobCard
            key={job.id}
            title={job.title}
            salary={job.salary} 
            equity={job.equity}
            companyHandle={job.companyHandle}
        />
        ))


    return (
    <div className="CompanyCard">
        <Card>
        <CardImg top width="100%"/>
        <CardBody>
            <CardTitle>{company.name}</CardTitle>
            <CardSubtitle><i>Employees: {company.numEmployees} </i></CardSubtitle>
            <CardText>{company.description}</CardText>
        </CardBody>
        </Card>
        {jobsList}
    </div>
    );
    }

export default Company;