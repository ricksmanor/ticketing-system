import React, { Component } from 'react';
import '../App.css';
import {
    Button,
    Header,
    Image,
    Modal,
    Form,
    Dropdown,
    Sidebar,
    Menu,
    Icon,
    Segment,
    List,
    Loader,
    Message
} from 'semantic-ui-react';
import axios from 'axios';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

const API = "https://ticketbooking-12.appspot.com/";
const eventsEndpoint = "events/";

class Dashboard extends Component {
    state = {
        events: [],
        loading: true,
        selectedEvent: null,
        modalOpen: false,
        error: null
    };

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents = async () => {
        try {
            const response = await axios.get(`${API}${eventsEndpoint}`);
            this.setState({ events: response.data, loading: false });
        } catch (error) {
            this.setState({ error: 'Error fetching events', loading: false });
        }
    };

    handleEventClick = (event) => {
        this.setState({ selectedEvent: event, modalOpen: true });
    };

    closeModal = () => {
        this.setState({ modalOpen: false, selectedEvent: null });
    };

    render() {
        const { events, loading, modalOpen, selectedEvent, error } = this.state;

        return (
            <div>
                <Header as='h2'>Event Dashboard</Header>
                {loading && <Loader active inline='centered' />}
                {error && <Message negative>{error}</Message>}
                {!loading && !error && (
                    <List>
                        {events.map(event => (
                            <List.Item key={event.id}>
                                <List.Content>
                                    <List.Header as='a' onClick={() => this.handleEventClick(event)}>
                                        {event.name}
                                    </List.Header>
                                    <List.Description>
                                        {event.date}
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        ))}
                    </List>
                )}

                {/* Modal for Event Details */}
                <Modal open={modalOpen} onClose={this.closeModal}>
                    <Modal.Header>{selectedEvent ? selectedEvent.name : ''}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <p>{selectedEvent ? selectedEvent.description : ''}</p>
                            <p>Date: {selectedEvent ? selectedEvent.date : ''}</p>
                            <p>Location: {selectedEvent ? selectedEvent.location : ''}</p>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.closeModal} color='red'>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default Dashboard;