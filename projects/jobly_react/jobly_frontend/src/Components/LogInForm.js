import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import { Button, Form, FormGroup, Input, Label} from 'reactstrap';
import Alert from "./Alert";
import "../Styles/AuthForms.css";

function LogInForm({ login }){
    const history = useHistory();
    const INITIAL_STATE_FORM = {
        username: '',
        password: ''
    }
    const [formData, setFormData] = useState(INITIAL_STATE_FORM);
    const [formErrors, setFormErrors] = useState([]);
    
    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    async function submitForm(evt){
        evt.preventDefault();
        console.log("logging in!");
        let res = await login(formData);
        if (res.success){
            history.push("/")
        }else{
            setFormErrors(res.errors);
        }
    }

    return (
        <div className="LogInFormContainer">
            <div className="LogInForm">
                <h1>Log In</h1>
                <Form onSubmit={submitForm}>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input onChange={handleChange} type="text" name="username" id="username" placeholder="Username" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input onChange={handleChange} type="password" name="password" id="password" placeholder="Password" />
                    </FormGroup>
                    {
                        formErrors.length
                        ? <Alert type="danger" messages={formErrors} />
                        : null
                    }
                    <Button className="btn btn-primary">Log In</Button>
                </Form>
            </div>
        </div>
    )
}

export default LogInForm;