import React, { Component } from 'react';
import '../App.css';
import { Button, Modal, Dropdown, Divider, Form, Input, Grid, Card } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { fetchShows, addShow } from '../actions/showsActions'; // Import your action creators
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import moment from 'moment';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import loadingIcon from '../assets/icons/loading.gif';

const APIURL = "https://ticketbooking-12.appspot.com";
const listclientscreen = '/client/listscreens';
const listevent = "/client/listevents";
const listcatforscreen = "/categories"; 
const ctoken = localStorage.getItem('USER_TOKEN');

class Shows extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingCategory: true,
            isLoadingScreen: true,
            isLoadingEvents: true,
            eventData: [],
            screenData: [],
            categoryData: [],
            newshowform: false,
            eventId: null,
            screenId: null,
            showDateTime: '',
        };
    }

    handleDateTimeChange = (event, { name, value }) => {
        this.setState({ showDateTime: value });
    }

    toggleNewShowForm = () => {
        this.setState(prevState => ({
            newshowform: !prevState.newshowform,
            screenId: null,
            categoryData: [],
            isLoadingScreen: true,
            isLoadingEvents: true,
            isLoadingCategory: true
        }), () => {
            if (this.state.newshowform) {
                this.fetchScreensAndEvents();
            }
        });
    }

    fetchScreensAndEvents = () => {
        const fetchScreens = axios.get(APIURL + listclientscreen, {
            headers: { 'USER_TOKEN': ctoken }
        });

        const fetchEvents = axios.get(APIURL + listevent, {
            headers: { 'USER_TOKEN': ctoken }
        });

        Promise.all([fetchScreens, fetchEvents])
            .then(([screenResponse, eventResponse]) => {
                const screenData = screenResponse.data.map(obj => ({
                    key: obj.id,
                    value: obj.id,
                    location: obj.location,
                    text: obj.name
                }));
                const eventData = eventResponse.data.map(obj => ({
                    key: obj.id,
                    value: obj.id,
                    duration: obj.duration,
                    text: obj.name
                }));

                this.setState({
                    screenData,
                    eventData,
                    isLoadingScreen: false,
                    isLoadingEvents: false
                });
            })
            .catch(error => {
                console.error(error);
                toast.error('Error fetching screens or events', { position: toast.POSITION.TOP_CENTER });
            });
    }

    changeEvent = (event, data) => {
        this.setState({ eventId: data.value });
    }

    changeScreen = (event, data) => {
        this.setState({ screenId: data.value, isLoadingCategory: true }, () => {
            this.getCategoryforScreen(data.value);
        });
    }

    getCategoryforScreen = (cid) => {
        axios.get(`${APIURL}${listclientscreen}/${cid}${listcatforscreen}`, {
            headers: { 'USER_TOKEN': ctoken }
        })
            .then(response => {
                const categoryData = response.data;
                this.setState({ categoryData, isLoadingCategory: false });
            })
            .catch(error => {
                console.error(error);
                toast.error('Error fetching categories', { position: toast.POSITION.TOP_CENTER });
            });
    }

    handleShowSubmit = (event) => {
        event.preventDefault();
        const { eventId, screenId, showDateTime } = this.state;

        const categoryPriceData = this.state.categoryData.map(cat => ({
            category: cat.id,
            price: cat.price || null // Assuming you have a way to get the price
        }));

        this.props.addShow({
            event_id: eventId,
            screen_id: screenId,
            datetime: showDateTime,
            'category-price': categoryPriceData
        })
        .then(response => {
            this.setState({ newshowform: false });
            toast.success('Response: ' + response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                zIndex: 199
            });
            this.props.fetchShows(); // Refresh the shows list after adding a new show
        })
        .catch(error => {
            console.error(error);
            toast.error('Error submitting show', { position: toast.POSITION.TOP_CENTER });
        });
        render() 
            const { isLoadingScreen, isLoadingEvents, isLoadingCategory, screenData, eventData, categoryData, newshowform } = this.state;
        
            return (
                <div className="shows-container">
                    <ToastContainer />
                    <Button onClick={this.toggleNewShowForm}>
                        {newshowform ? 'Cancel' : 'Add New Show'}
                    </Button>
                    {newshowform && (
                        <Modal open={newshowform} onClose={this.toggleNewShowForm}>
                            <Modal.Header>Add New Show</Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.handleShowSubmit}>
                                    <Form.Field>
                                        <label>Event</label>
                                        <Dropdown
                                            placeholder='Select Event'
                                            fluid
                                            selection
                                            options={eventData}
                                            onChange={this.changeEvent}
                                            loading={isLoadingEvents}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Screen</label>
                                        <Dropdown
                                            placeholder='Select Screen'
                                            fluid
                                            selection
                                            options={screenData}
                                            onChange={this.changeScreen}
                                            loading={isLoadingScreen}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Show Date & Time</label>
                                        <DateTimeInput
                                            name="showDateTime"
                                            placeholder="Date and Time"
                                            value={this.state.showDateTime}
                                            onChange={this.handleDateTimeChange}
                                            timeFormat="24"
                                            dateFormat="YYYY-MM-DD"
                                            closable
                                        />
                                    </Form.Field>
                                    <Divider />
                                    <h4>Categories and Prices</h4>
                                    {isLoadingCategory ? (
                                        <p>Loading categories...</p>
                                    ) : (
                                        categoryData.map(cat => (
                                            <Form.Field key={cat.id}>
                                                <label>{cat.name}</label>
                                                <Input
                                                    type="number"
                                                    placeholder="Price"
                                                    defaultValue={cat.price || ''}
                                                    onChange={(e) => {
                                                        const updatedCategoryData = categoryData.map(c => {
                                                            if (c.id === cat.id) {
                                                                return { ...c, price: e.target.value };
                                                            }
                                                            return c;
                                                        });
                                                        this.setState({ categoryData: updatedCategoryData });
                                                    }}
                                                />
                                            </Form.Field>
                                        ))
                                    )}
                                    <Button type='submit' primary>Add Show</Button>
                                </Form>
                            </Modal.Content>
                        </Modal>
                    )}
                </div>
                    
            );
        }
    }

    export default Shows; // Ensure this line is present
