import React, { Component } from 'react';
import axios from 'axios';
import { Card, Loader, Image, Grid, Button, Message } from 'semantic-ui-react';
import config from 'react-global-configuration';
import { Link } from 'react-router-dom';

class ShowsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shows: [],
            loading: true,
            error: null
        };
    }

    showCard = (details) => {
        return (
            <Card key={details.show_id}>
                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
                <Card.Content>
                    <Card.Header>{details.client_name}</Card.Header>
                    <Card.Meta>
                        <span>{details.datetime}</span>
                    </Card.Meta>
                    <Card.Meta>
                        <span>
                            <Link to={`/events/${this.props.match.params.event_id}/shows/${details.show_id}`}>
                                <Button>Buy tickets</Button>
                            </Link>
                        </span>
                    </Card.Meta>
                </Card.Content>
            </Card>
        );
    }

    render() {
        const { shows, loading, error } = this.state;

        if (loading) {
            return <Loader active inline='centered' />;
        }

        if (error) {
            return (
                <Message error>
                    <Message.Header>Error Loading Shows</Message.Header>
                    <p>{error}</p>
                </Message>
            );
        }

        if (shows.length === 0) {
            return (
                <Message info>
                    <Message.Header>No Shows Available</Message.Header>
                    <p>There are currently no shows available for this event.</p>
                </Message>
            );
        }

        return (
            <div>
                <Grid columns={5}>
                    {shows.map((show) => (
                        <Grid.Column key={show.show_id}>
                            {this.showCard(show)}
                        </Grid.Column>
                    ))}
                </Grid>
            </div>
        );
    }

    componentDidMount() {
        this.fetchShows();
    }

    fetchShows = () => {
        const { event_id } = this.props.match.params;

        axios.get(`${config.get('base_url')}/events/${event_id}/shows`)
            .then((response) => {
                this.setState({ shows: response.data, loading: false });
            })
            .catch((error) => {
                console.error("There was an error fetching the shows!", error);
                this.setState({ error: 'Failed to load shows. Please try again later.', loading: false });
            });
    }
}

export default ShowsList;