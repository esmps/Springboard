import React from 'react';
import { Card, CardText, CardBody,
  CardTitle, Button } from 'reactstrap';
// import "../Styles/JobCard.css";

function JobCard({title, salary, equity, companyHandle}) {
  return (
    <div className="JobCard">
      <Card>
        <CardBody>
          <CardTitle>{title}</CardTitle>
          <CardText>
              Equity: {equity ? equity : "N/A"}
              <br></br>
             Salary: {salary ? salary : "N/A"}
          </CardText>
          <Button>Apply</Button>
        </CardBody>
      </Card>
    </div>
  );
  }

export default JobCard;