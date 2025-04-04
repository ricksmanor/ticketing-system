import React, { Component } from 'react';
import config from 'react-global-configuration';
import axios from 'axios';
import { Form, Button, Loader, Message } from 'semantic-ui-react';

class UserRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            success: null,
            formData: {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                contact: '',
                description: '',
            },
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value,
            },
        }));
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true, error: null, success: null });

        axios.post(`${config.get('base_url')}/register`, this.state.formData)
            .then(response => {
                if (response.status === 201) {
                    this.setState({ success: 'Registration successful!', loading: false });
                }
            })
            .catch(error => {
                console.error("There was an error during registration!", error);
                this.setState({ error: 'Failed to register. Please try again later.', loading: false });
            });
    }

    render() {
        const { loading, error, success, formData } = this.state;

        return (
            <div>
                {loading && <Loader active inline='centered' />}
                {error && (
                    <Message error>
                        <Message.Header>Error</Message.Header>
                        <p>{error}</p>
                    </Message>
                )}
                {success && (
                    <Message success>
                        <Message.Header>Success</Message.Header>
                        <p>{success}</p>
                    </Message>
                )}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Input
                        label='First Name'
                        name='first_name'
                        value={formData.first_name}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        label='Last Name'
                        name='last_name'
                        value={formData.last_name}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        label='Email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        label='Password'
                        name='password'
                        type='password'
                        value={formData.password}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Input
                        label='Contact'
                        name='contact'
                        value={formData.contact}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.TextArea
                        label='Description'
                        name='description'
                        value={formData.description}
                        onChange={this.handleChange}
                    />
                    <Button type='submit' primary>Register</Button>
                </Form>
            </div>
        );
    }
}

export default UserRegister;