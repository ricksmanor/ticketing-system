import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {
    Button,
    Modal,
    Form,
    Label,
    Grid,
    Card,
    Icon,
    Message,
    Loader
} from 'semantic-ui-react';
import config from 'react-global-configuration';
import loadingIcon from '../assets/icons/loading.gif';

const APIURL = "https://ticketbooking-12.appspot.com";
const ctoken = localStorage.getItem('USER_TOKEN');

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            eventData: [],
            neweventform: false,
            eventId: null,
            eventname: '',
            eventdescription: '',
            eventduration: '',
            uploadedimage: null,
            errorMessage: '',
            successMessage: ''
        };
    }

    toggleNewEventForm = () => {
        this.setState({
            neweventform: !this.state.neweventform,
            uploadedimage: null,
            errorMessage: '',
            successMessage: ''
        });
    }

    handleUploadImage = (event) => {
        this.setState({
            uploadedimage: URL.createObjectURL(event.target.files[0])
        });
    }

    handleFormChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    validateForm = () => {
        const { eventname, eventdescription, eventduration } = this.state;
        if (!eventname || !eventdescription || !eventduration) {
            this.setState({ errorMessage: 'All fields are required.' });
            return false;
        }
        if (isNaN(eventduration) || eventduration <= 0) {
            this.setState({ errorMessage: 'Duration must be a positive number.' });
            return false;
        }
        this.setState({ errorMessage: '' });
        return true;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.validateForm()) return;

        const { eventname, eventdescription, eventduration, uploadedimage } = this.state;
        const formData = new FormData();
        formData.append('name', eventname);
        formData.append('description', eventdescription);
        formData.append('duration', eventduration);
        if (uploadedimage) {
            formData.append('image', uploadedimage);
        }

        axios.post(`${APIURL}/events/add`, formData, {
            headers: {
                'USER_TOKEN': ctoken,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            this.setState(prevState => ({
                eventData: [...prevState.eventData, response.data],
                neweventform: false,
                successMessage: 'Event added successfully!',
                uploadedimage: null,
                eventname: '',
                eventdescription: '',
                eventduration: ''
            }));
        })
        .catch(error => {
            console.error("There was an error adding the event!", error);
            this.setState({ errorMessage: 'Failed to add event. Please try again.' });
        });
    }

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents = () => {
        axios.get(`${APIURL}/client/listevents`, {
            headers: {
                'USER_TOKEN': ctoken
            }
        })
        .then(response => {
            this.setState({ eventData: response.data, isLoading: false });
        })
        .catch(error => {
            console.error("There was an error fetching the events!", error);
            this.setState({ errorMessage: 'Failed to fetch events. Please try again.', isLoading: false });
        });
    }

    render() {
        const { isLoading, eventData, neweventform, errorMessage, successMessage, uploadedimage } = this.state;

        return (
            <div>
                <Button
                    style={{ float: 'right' }}
                    primary
                    onClick={this.toggleNewEventForm}
                >
                    Add New Event
                </Button>
                <h1 align='center'>Event List</h1>
                {errorMessage && <Message negative>{errorMessage}</Message>}
                {successMessage && <Message positive>{successMessage}</Message>}
                
                {isLoading ? (
                    <Loader active inline='centered' />
                ) : (
                    <Grid columns={3}>
                        {eventData.map(event => {
                            const { id, name, description, duration } = event;
                            return (
                                <Grid.Column key={id}>
                                    <Card>
                                        <Card.Content header={name} />
                                        <Card.Content description={description} />
                                        <Card.Content extra>
                                            <Icon name='clock' /> {duration} min
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            );
                        })}
                    </Grid>
                )}

                <Modal dimmer='blurring' open={neweventform} onClose={this.toggleNewEventForm}>
                    <Modal.Header>Add New Event</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group>
                                <div style={{ width: '50%' }}>
                                    <Form.Field>
                                        <label>Event Name</label>
                                        <input
                                            name="eventname"
                                            placeholder='Event Name'
                                            value={this.state.eventname}
                                            onChange={this.handleFormChange}
                                        />
                                    </Form.Field>

                                    <Form.Field>
                                        <label>Event Description</label>
                                        <input
                                            name="eventdescription"
                                            placeholder='Event Description'
                                            value={this.state.eventdescription}
                                            onChange={this.handleFormChange}
                                        />
                                    </Form.Field>

                                    <Form.Field>
                                        <label>Event Duration</label>
                                        <input
                                            type='number'
                                            name="eventduration"
                                            placeholder="Duration in minutes"
                                            value={this.state.eventduration}
                                            onChange={this.handleFormChange}
                                        />
                                    </Form.Field>
                                </div>
                                <div>
                                    <Form.Field>
                                        <Label as="label" basic htmlFor="upload">
                                            <Button
                                                icon="upload"
                                                label={{
                                                    basic: true,
                                                    content: 'Select file(s)'
                                                }}
                                                labelPosition="right"
                                            />
                                            <input
                                                hidden
                                                id="upload"
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                onChange={this.handleUploadImage}
                                            />
                                        </Label>
                                    </Form.Field>
                                    {uploadedimage && <img height="200px" width="200px" src={uploadedimage} alt="Preview" />}
                                </div>
                            </Form.Group>
                            <Modal.Actions>
                                <Button color='red' onClick={this.toggleNewEventForm}>
                                    Cancel
                                </Button>
                                <Button
                                    positive
                                    icon='checkmark'
                                    labelPosition='right'
                                    content="Submit"
                                    onClick={this.handleSubmit}
                                />
                            </Modal.Actions>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default Events;