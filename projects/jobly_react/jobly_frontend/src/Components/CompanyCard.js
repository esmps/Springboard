import React from 'react';
import { Card, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import "../Styles/CompanyCard.css";

function CompanyCard({handle, name, description, numEmployees, logoUrl}) {
  return (
    <div className="CompanyCard">
      <Card>
          <CardBody>
          <CardTitle><b>{name}</b></CardTitle>
          <CardSubtitle><i>Employees: {numEmployees}</i></CardSubtitle>
          <CardText>{description}</CardText>
          <Button className="CompanyCard-btn"><a href={`/companies/${handle}`}>See jobs</a></Button>
        </CardBody>
      </Card>
    </div>
  );
  }

export default CompanyCard;