import React, { Component } from 'react';
import axios from 'axios';
import { Card, Loader, Image, Grid, Message } from 'semantic-ui-react';
import config from 'react-global-configuration';
import { Link } from 'react-router-dom';

class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            loading: true,
            error: null
        };
    }

    eventCard = (details) => {
        return (
            <Grid.Column key={details.event_id}>
                <Link to={`/events/${details.event_id}/shows`}>
                    <Card>
                        <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
                        <Card.Content>
                            <Card.Header>{details.name}</Card.Header>
                            <Card.Meta>
                                <span>{details.client_name}</span>
                            </Card.Meta>
                            <Card.Description>{details.description}</Card.Description>
                        </Card.Content>
                    </Card>
                </Link>
            </Grid.Column>
        );
    }

    render() {
        const { events, loading, error } = this.state;

        if (loading) {
            return <Loader active inline='centered' />;
        }

        if (error) {
            return (
                <Message error>
                    <Message.Header>Error Loading Events</Message.Header>
                    <p>{error}</p>
                </Message>
            );
        }

        if (events.length === 0) {
            return (
                <Message info>
                    <Message.Header>No Events Available</Message.Header>
                    <p>There are currently no events available.</p>
                </Message>
            );
        }

        return (
            <div>
                <Grid columns={5}>
                    {events.map((event) => this.eventCard(event))}
                </Grid>
            </div>
        );
    }

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents = () => {
        axios.get(`${config.get('base_url')}/events`)
            .then((response) => {
                this.setState({ events: response.data, loading: false });
            })
            .catch((error) => {
                console.error("There was an error fetching the events!", error);
                this.setState({ error: 'Failed to load events. Please try again later.', loading: false });
            });
    }
}

export default EventList;