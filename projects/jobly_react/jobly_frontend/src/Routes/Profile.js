import React, { useState, useContext } from "react";
import { Button, Form, FormGroup, Input, Label} from 'reactstrap';
import Alert from "../Components/Alert";
import CurrUserContext from '../Context/CurrUserContext';
import JoblyApi from "../Helpers/api";
import "../Styles/AuthForms.css";


function Profile() {
  const {currUser, setCurrUser} = useContext(CurrUserContext);
    const INITIAL_STATE_FORM = {
      firstName: currUser.firstName,
      lastName: currUser.lastName,
      email: currUser.email,
      password: ''
    }
    const [formData, setFormData] = useState(INITIAL_STATE_FORM);
    const [formErrors, setFormErrors] = useState([]);
    const [updatedSaved, setUpdateSaved] = useState(false);

    const handleChange = evt => {
      const { name, value } = evt.target;
      setFormData(formData => ({
          ...formData,
          [name]: value
      }));
      console.log(formData);
      setFormErrors([]);
    };

    async function submitForm(evt){
      evt.preventDefault();
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        email: formData.email
      }
      const username = currUser.username;
      let updatedUser;
      try{
        updatedUser = await JoblyApi.updateUserInfo(username, profileData);
      }catch(errors){
        setFormErrors(errors);
        return;
      }
      setFormData(fields => ({ ...fields, password: "" }));
      setFormErrors([]);
      setUpdateSaved(true);

      setCurrUser(updatedUser);
  }

    return (
      <div className="ProfileFormContainer">
           <div className="ProfileForm">
                <h1>Profile</h1>
                <h5><b>Username:</b> {currUser.username}</h5>
                <Form onSubmit={submitForm}>
                <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input onChange={handleChange} type="text" name="firstName" id="firstName" value={formData.firstName}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input onChange={handleChange} type="text" name="lastName" id="lastName" value={formData.lastName} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input onChange={handleChange} type="email" name="email" id="email" value={formData.email} />
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
                    {
                      updatedSaved
                      ? <Alert type="success" messages={["Updated successfully."]} />
                      : null
                    }
                    <Button className="btn btn-primary float-right">Update Profile</Button>
                </Form>
            </div>
      </div>
    );
  }

export default Profile;