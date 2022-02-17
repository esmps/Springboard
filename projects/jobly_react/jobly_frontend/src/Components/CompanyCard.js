import React from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import "../Styles/CompanyCard.css";

function CompanyCard({name, description, numEmployees, logoUrl}) {
  return (
    <div className="CompanyCard">
      <Card>
        <CardImg top width="100%" src={logoUrl} alt={name + " logo"} />
        <CardBody>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle><i>Employees: {numEmployees}</i></CardSubtitle>
          <CardText>{description}</CardText>
          <Button>Apply</Button>
        </CardBody>
      </Card>
    </div>
  );
  }

export default CompanyCard;