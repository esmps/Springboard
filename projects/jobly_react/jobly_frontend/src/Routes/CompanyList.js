import React, { useState, useEffect } from 'react';
import JoblyApi from "../Helpers/api";
import CompanyCard from "../Components/CompanyCard";
import SearchForm from '../Components/SearchForm';
import "../Styles/CompanyList.css"


function CompanyList() {
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
    return <p>Loading &hellip;</p>;
  }

  const companiesList = companies.map(company => (
    <CompanyCard
      key={company.handle}
      handle={company.handle}
      name={company.name} 
      description={company.description}
      numEmployees={company.numEmployees}
      logoUrl={company.logoUrl}
    />
  ))
  

  return (
      <div className="CompanyList col-md-8 offset-md-2">
        <SearchForm queries={queries} setQueries={setQueries}/>
        {companiesList}
      </div>
  );
  }

export default CompanyList;