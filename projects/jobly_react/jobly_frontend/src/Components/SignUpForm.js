import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import { Button, Form, FormGroup, Input, Label} from 'reactstrap';
import Alert from "./Alert";
import "../Styles/AuthForms.css";

function LogInForm({ signup }){
    const history = useHistory();
    const INITIAL_STATE_FORM = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
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
        let res = await signup(formData);
        if (res.success){
            history.push("/")
        }else{
            setFormErrors(res.errors);
        }
    }

    return (
        <div className="SignUpFormContainer">
            <div className="SignUpForm">
                <h1>Sign Up</h1>
                <Form onSubmit={submitForm}>
                <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input onChange={handleChange} type="text" name="firstName" id="firstName" placeholder="First Name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input onChange={handleChange} type="text" name="lastName" id="lastName" placeholder="Last Name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input onChange={handleChange} type="text" name="username" id="username" placeholder="Username" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input onChange={handleChange} type="email" name="email" id="email" placeholder="Email" />
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
                    <Button className="btn btn-primary float-right">Sign Up</Button>
                </Form>
            </div>
        </div>
    )
}

export default LogInForm;