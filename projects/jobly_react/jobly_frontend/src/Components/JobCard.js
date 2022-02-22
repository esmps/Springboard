import React, {useState, useEffect, useContext} from 'react';
import { Card, CardText, CardBody,
  CardTitle, Button, CardSubtitle } from 'reactstrap';
import CurrUserContext from '../Context/CurrUserContext';
import "../Styles/JobCard.css";

function JobCard({id, title, salary, equity, companyName, companyHandle}) {
  const {hasAppliedToJob, applyToJob} = useContext(CurrUserContext);
  const [hasApplied, setHasApplied] = useState();


  useEffect(function updateAppliedStatus() {
      setHasApplied(hasAppliedToJob(id));
    }, [id, hasAppliedToJob]
  );

  async function handleApply(evt){
    evt.preventDefault();
    if (hasAppliedToJob(id)) return;
    applyToJob(id);
    setHasApplied(true);
  }

  return (
    <div className="JobCard">
      <Card>
        <CardBody>
          <CardTitle>{title}</CardTitle>
          <CardSubtitle><a href={`/companies/${companyHandle}`}><i>{companyName}</i></a></CardSubtitle>
          <CardText>
              Equity: {equity ? equity : "N/A"}
              <br></br>
             Salary: {salary ? salary : "N/A"}
          </CardText>
          <Button className="JobCard-btn" onClick={handleApply} disabled={hasApplied}>
            {hasApplied ? "Applied" : "Apply"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
  }

export default JobCard;