import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'; 
import { Form, Button, Grid, Segment, Divider } from 'semantic-ui-react';
import axios from 'axios';
import config from 'react-global-configuration';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggedIn: false,
            error: null, // To store any login error messages
        };

        this.login = this.login.bind(this);
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    render() {
        const { username, password, loggedIn, error } = this.state;

        // Redirect if logged in
        if (loggedIn) {
            return <Redirect to='/' />;
        }

        return (   
            <Grid centered>
                <Grid.Column width={5}>
                    <Segment inverted>
                        <Form inverted onSubmit={this.login}>
                            <Form.Input 
                                label='Username' 
                                placeholder='Username' 
                                name="username" 
                                value={username} 
                                onChange={this.handleChange} 
                            />
                            <Form.Input 
                                label='Password' 
                                type='password' 
                                placeholder='Password' 
                                name="password" 
                                value={password} 
                                onChange={this.handleChange} 
                            />
                            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
                            <Button type='submit'>Login</Button>
                            <Divider />
                            <Segment inverted textAlign='center'>
                                Don't have an account? <br /> 
                                <Link to='/register/user'> Click here to register</Link>
                            </Segment>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>  
        );
    }

    login() {
        const { username, password } = this.state;

        axios({
            method: 'post',
            url: `${config.get('base_url')}/login`,
            data: { username, password },
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.status === 200) {
                localStorage.setItem('USER_TOKEN', response.data.token);
                localStorage.setItem('username', username);
                localStorage.setItem('user_type', response.data.user_kind);
                this.setState({ loggedIn: true, error: null }); // Reset error on successful login
            }
        })
        .catch(error => {
            console.error(error);
            this.setState({ error: 'Invalid username or password' }); // Set error message on failure
        });
    }
}

export default Login;