import React, { Component } from 'react';
import '../App.css';
import {
    Button,
    Header,
    Modal,
    Message,
    Loader
} from 'semantic-ui-react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const API = "https://ticketbooking-12.appspot.com/";
const getEventEndpoint = "events/";

class EventDetail extends Component {
    state = {
        event: null,
        loading: true,
        error: null
    };

    componentDidMount() {
        const { match } = this.props;
        const eventId = match.params.id; // Assuming the event ID is passed in the URL
        this.fetchEventDetails(eventId);
    }

    fetchEventDetails = async (eventId) => {
        try {
            const response = await axios.get(`${API}${getEventEndpoint}${eventId}`);
            this.setState({ event: response.data, loading: false });
        } catch (error) {
            this.setState({ error: 'Error fetching event details', loading: false });
        }
    };

    render() {
        const { event, loading, error } = this.state;

        return (
            <div>
                {loading && <Loader active inline='centered' />}
                {error && <Message negative>{error}</Message>}
                {event && (
                    <div>
                        <Header as='h2'>{event.name}</Header>
                        <p><strong>Description:</strong> {event.description}</p>
                        <p><strong>Date:</strong> {event.date}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <Button onClick={() => this.props.history.push('/dashboard')} color='blue'>
                            Back to Dashboard
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(EventDetail);