import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EventDetail from './EventDetail'; 
import { Form, Button, Grid, Segment, Message } from 'semantic-ui-react';
import axios from 'axios';
import config from 'react-global-configuration';

class ClientRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            contact: '',
            description: '',
            first_name: '',
            last_name: '',
            middle_name: '',
            location: '',
            dob: '',
            successMessage: '',
            errorMessage: '',
            loading: false
        };
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    validateForm = () => {
        const { username, password, email, contact, first_name, last_name, location, dob } = this.state;
        if (!username || !password || !email || !contact || !first_name || !last_name || !location || !dob) {
            this.setState({ errorMessage: 'All fields are required.' });
            return false;
        }
        // Additional validation can be added here (e.g., email format, password strength)
        this.setState({ errorMessage: '' });
        return true;
    }

    register = (e) => {
        e.preventDefault(); // Prevent the default form submission
        if (!this.validateForm()) return; // Validate the form

        this.setState({ loading: true, successMessage: '', errorMessage: '' });
        console.log(JSON.stringify(this.state));

        axios.post(config.get('base_url') + '/register/client', this.state, {
            headers: { 'CLIENT_TOKEN': localStorage.getItem('CLIENT_TOKEN') }
        })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                localStorage.removeItem('CLIENT_TOKEN');
                this.setState({ successMessage: 'Registration successful!', loading: false });
                // Optionally redirect or reset the form
            }
        })
        .catch(error => {
            console.error("There was an error registering the client!", error);
            this.setState({ errorMessage: 'Registration failed. Please try again.', loading: false });
        });
    }

    componentDidMount() {
        const { token } = this.props.match.params;
        localStorage.setItem('CLIENT_TOKEN', token);
    }

    render() {
        const { username, password, email, contact, description, first_name, last_name, middle_name, location, dob, successMessage, errorMessage, loading } = this.state;

        return (
            <Grid centered>
                <Grid.Column width={12}>
                    <Segment inverted>
                        {successMessage && <Message success>{successMessage}</Message>}
                        {errorMessage && <Message error>{errorMessage}</Message>}
                        <Form inverted onSubmit={this.register} loading={loading}>
                            <Form.Group widths="equal">
                                <Form.Input label='Username' placeholder='Username' name="username" value={username} onChange={this.handleChange} />
                                <Form.Input label='Password' placeholder='Password' type='password' name="password" value={password} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Input label='Email' placeholder='Email' name="email" value={email} onChange={this.handleChange} />
                            <Form.Input label='Contact number' placeholder='Contact' name="contact" value={contact} onChange={this.handleChange} />
                            <Form.Input label='Description' placeholder='Description' name="description" value={description} onChange={this.handleChange} />
                            <Form.Group widths="equal">
                                <Form.Input label='First Name' placeholder='First Name' name="first_name" value={first_name} onChange={this.handleChange} />
                                <Form.Input label='Middle Name' placeholder='Middle Name' name="middle_name" value={middle_name} onChange={this.handleChange} />
                                <Form.Input label='Last Name' placeholder='Last Name' name="last_name" value={last_name} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Input label='Location' placeholder='Location' name="location" value={location} onChange={this.handleChange} />
                            <Form.Input label='Date of Birth (DD/MM/YYYY)' placeholder='DD/MM/YYYY' name="dob" value={dob} onChange={this.handleChange} />
                            <Button type='submit' loading={loading}>Register</Button>
                        </Form>
                    </Segment>
                </Grid.Column>
                </Grid>
        );
    }
}
function App() {
  return (
      <Router>
        <div>
        <Header loggedIn={this.state.loggedIn} onLogout={this.handleLogout} />
          <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/event/:id" component={EventDetail} />
              {/* Add other routes as needed */}
          </Switch>
        </div>
      </Router>
  );
}

export default ClientRegister;