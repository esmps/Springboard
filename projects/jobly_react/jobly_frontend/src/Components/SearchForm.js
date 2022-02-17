import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import { Button, Form, FormGroup, Input} from 'reactstrap';
import "../Styles/SearchForm.css";

function SearchForm({ queries, setQueries}){
    const history = useHistory();
    const INITIAL_STATE_FORM = {
        minEmployees: '',
        maxEmployees: '',
        name: ''
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
            if(value !== ''){
                newQueries.push(`${key}=${value}`);
            }
        }
        setQueries(newQueries.join('&'));
        setFormData(INITIAL_STATE_FORM);
        history.push(`/companies`);
    }

    return (
        <div className="SearchForm">
            <Form onSubmit={updateQuery}>
                <FormGroup className="d-flex">
                    <Input onChange={handleChange} type="number" name="minEmployees" id="minEmployees" placeholder="Minimum Employees" />
                    <Input onChange={handleChange} type="number" name="maxEmployees" id="maxEmployees" placeholder="Maximum Employees" />
                </FormGroup>
                <FormGroup className="d-flex">
                    <Input onChange={handleChange} type="text" name="name" id="name" placeholder="Enter search term..." />
                    <Button>Submit</Button>
                </FormGroup>
            </Form>
        </div>
    )
}

export default SearchForm;