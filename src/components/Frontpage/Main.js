import React, { Component } from 'react';
import Featured from './Featured';
import EventList from './EventsList'; // Ensure the import matches the filename
import axios from 'axios';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import { Container, Message } from 'semantic-ui-react';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: true,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        // Example API call to fetch data if needed
        axios.get('YOUR_API_ENDPOINT_HERE') // Replace with your actual API endpoint
            .then(response => {
                // Handle successful response
                this.setState({ loading: false });
            })
            .catch(error => {
                console.error("There was an error fetching data!", error);
                this.setState({ error: 'Failed to load data. Please try again later.', loading: false });
            });
    }

    render() {
        const { error, loading } = this.state;

        return (
            <Container>
                {loading && <Message info>Loading...</Message>}
                {error && (
                    <Message error>
                        <Message.Header>Error</Message.Header>
                        <p>{error}</p>
                    </Message>
                )}
                <Featured />
                <EventList />
            </Container>
        );
    }
}

export default Main;