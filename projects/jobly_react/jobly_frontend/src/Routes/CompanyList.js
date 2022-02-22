import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import JoblyApi from "../Helpers/api";
import CompanyCard from "../Components/CompanyCard";
import CompaniesSearchForm from '../Components/CompaniesSearchForm';
import CurrUserContext from '../Context/CurrUserContext';
import "../Styles/CompanyList.css";
import "../Styles/Loading.css";


function CompanyList() {
  const {currUser} = useContext(CurrUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [queries, setQueries] = useState("");

  useEffect(() => {
    async function getCompanies() {
      let companies = await JoblyApi.getCompanies(queries);
      setCompanies(companies);
      setIsLoading(false);
    }
    getCompanies();
  }, [queries]);

  if (isLoading) {
    return <p className="loading">Loading &hellip;</p>;
  }

  const companiesList = companies.map(company => (
    <CompanyCard
      key={company.handle}
      handle={company.handle}
      name={company.name} 
      description={company.description}
      numEmployees={company.numEmployees}
    />
  ))
  

  return (
    <>
      {
        currUser ? 
        <>
          <div className="CompanyList col-md-8 offset-md-2">
            <CompaniesSearchForm setQueries={setQueries}/>
            {companiesList}
          </div>
        </>
        :
        <Redirect to="/"></Redirect>
      }
    </>
    );
  }

export default CompanyList;