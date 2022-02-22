import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import { Button, Form, FormGroup, Input, Label} from 'reactstrap';
import "../Styles/JobsSearchForm.css";

function JobsSearchForm({ setQueries}){
    const history = useHistory();
    const INITIAL_STATE_FORM = {
        minSalary: '',
        hasEquity: '',
        title: ''
    }
    const [formData, setFormData] = useState(INITIAL_STATE_FORM);
    
    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const updateQuery = evt => {
        evt.preventDefault();
        evt.target.reset();
        let newQueries = [];
        for (const [key, value] of Object.entries(formData)){
            if(value !== '' && value !== 'Select One'){
                newQueries.push(`${key}=${value}`);
            }
        }
        setQueries(newQueries.join('&'));
        setFormData(INITIAL_STATE_FORM);
        history.push(`/jobs`);
    }

    return (
        <div className="JobsSearchForm">
            <Form onSubmit={updateQuery}>
                <FormGroup className="d-flex">
                    <Label for="hasEquity">Minimum Salary:</Label>
                    <Input onChange={handleChange} type="number" name="minSalary" id="minSalary" placeholder="Minimum Salary" />
                </FormGroup>
                <FormGroup className="d-flex">
                <Label for="hasEquity">Has Equity:</Label>
                    <Input onChange={handleChange}  type="select" name="hasEquity" id="hasEquity">
                        <option>Select One</option>
                        <option>true</option>
                        <option>false</option>
                    </Input>
                </FormGroup>
                <FormGroup  className="d-flex">
                    <Input onChange={handleChange} type="text" name="title" id="title" placeholder="Search job titles..." />
                    <Button>Submit</Button>
                </FormGroup>
            </Form>
        </div>
    )
}

export default JobsSearchForm;