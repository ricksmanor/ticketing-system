import React, { Component } from 'react';
import config from 'react-global-configuration';
import UserDetails from './UserDetails';
import UserSettings from './UserSettings';
import { Message } from 'semantic-ui-react'; 
import { Route, Switch} from 'react-router-dom';
import axios from 'axios';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: null,
            userData: null,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        axios.get(`${config.get('base_url')}/user`) // Replace with your actual API endpoint
            .then(response => {
                this.setState({ userData: response.data, loading: false });
            })
            .catch(error => {
                console.error("There was an error fetching user data!", error);
                this.setState({ error: 'Failed to load user data. Please try again later.', loading: false });
            });
    }

    render() {
        const { loading, error, userData } = this.state;

        if (loading) {
            return <Message info>Loading user data...</Message>;
        }

        if (error) {
            return (
                <Message error>
                    <Message.Header>Error</Message.Header>
                    <p>{error}</p>
                </Message>
            );
        }

        return (
            <div>
                <Switch>
                    <Route 
                        exact 
                        path={this.props.match.path} 
                        render={(props) => <User Details {...props} userData={userData} />} 
                    />
                    <Route 
                        path={`${this.props.match.url}/settings`} 
                        render={(props) => <User Settings {...props} userData={userData} />} 
                    />
                </Switch>
            </div>
        );
    }
}

export default User;