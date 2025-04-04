import React, { Component } from 'react';
import config from 'react-global-configuration';
import axios from 'axios';
import { Card, Icon, Grid, Loader, Header, Message } from 'semantic-ui-react';

class UserDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            error: null,
            details: {},
        };
    }

    componentDidMount() {
        this.fetchDetails();
    }

    fetchDetails = () => {
        axios.get(`${config.get('base_url')}${this.props.match.url}`, {
            headers: { 'USER_TOKEN': localStorage.getItem('USER_TOKEN') }
        })
        .then(response => {
            if (response.status === 200) {
                this.setState({ details: response.data, loaded: true });
            }
        })
        .catch(error => {
            console.error("There was an error fetching user details!", error);
            this.setState({ error: 'Failed to load user details. Please try again later.', loaded: true });
        });
    }

    render() {
        const { loaded, error, details } = this.state;

        if (!loaded) {
            return <Loader active inline='centered' />;
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
            <Grid columns={2}>
                <Grid.Column>
                    <Card fluid>
                        <Card.Content>
                            <Header>{details.first_name} {details.last_name}</Header>
                        </Card.Content>
                        <Card.Content>Description: {details.description}</Card.Content>
                        <Card.Content>
                            <Icon name='envelope' />{details.email}
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='phone' />
                            {details.contact}
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserDetails;