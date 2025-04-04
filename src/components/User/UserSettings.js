import React, { Component } from 'react';
import config from 'react-global-configuration';
import axios from 'axios';
import { Form, Button, Loader, Message } from 'semantic-ui-react';

class UserSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            success: null,
            formData: {
                email: '',
                password: '',
                contact: '',
                description: '',
            },
        };
    }

    componentDidMount() {
        this.fetchSettings();
    }

    fetchSettings = () => {
        this.setState({ loading: true });
        axios.get(`${config.get('base_url')}/user/settings`, {
            headers: { 'USER_TOKEN': localStorage.getItem('USER_TOKEN') }
        })
        .then(response => {
            if (response.status === 200) {
                this.setState({ formData: response.data, loading: false });
            }
        })
        .catch(error => {
            console.error("There was an error fetching user settings!", error);
            this.setState({ error: 'Failed to load user settings. Please try again later.', loading: false });
        });
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

        axios.put(`${config.get('base_url')}/user/settings`, this.state.formData, {
            headers: { 'USER_TOKEN': localStorage.getItem('USER_TOKEN') }
        })
        .then(response => {
            if (response.status === 200) {
                this.setState({ success: 'Settings updated successfully!', loading: false });
            }
        })
        .catch(error => {
            console.error("There was an error updating user settings!", error);
            this.setState({ error: 'Failed to update settings. Please try again later.', loading: false });
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
                    <Button type='submit' primary>Update Settings</Button>
                </Form>
            </div>
        );
    }
}

export default UserSettings;