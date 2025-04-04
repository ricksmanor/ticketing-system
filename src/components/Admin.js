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
    Loader,
    Message
} from 'semantic-ui-react';
import ApiHandler from './ApiHandler';
import axios from 'axios';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import Events from './Events';
import Shows from './Shows';
import AddScreen from './Admin/AddScreen';
import config from 'react-global-configuration';

const API = "https://ticketbooking-12.appspot.com";
const eventsEndpoint = `${API}/events/`;
const api = new ApiHandler();

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderTab: 'dashboard',
            loading: false,
            error: null,
            data: null,
        };
        api.createEntity({ name: 'events' }); 
    }

    changeTab = (tabName) => {
        this.setState({ renderTab: tabName });
        if (tabName === 'events') {
            this.fetchEvents();
        }
    }

    fetchEvents = () => {
        this.setState({ loading: true, error: null });
        api.endpoints.events.getAll()
        .then(response => {
            this.setState({ eventsData: response.data, loading: false });
        })
        .catch(error => {
            console.error("There was an error fetching events!", error);
            this.setState({ error: 'Failed to load events. Please try again later.', loading: false });
        });
    }

    render() {
        const { renderTab, loading, error, data } = this.state;
        const styles = {
            sideicon: {
                float: 'left',
                marginRight: 20,
                marginLeft: -5
            },
            sidebaradmin: {
                position: 'absolute',
                height: '100%',
                width: '100%',
            }
        };

        return (
            <Sidebar.Pushable as={Segment} style={styles.sidebaradmin}>
                <Sidebar as={Menu} visible vertical>
                    <Menu.Item onClick={() => this.changeTab('dashboard')} as='a' name='home'>
                        <Icon name='home' style={styles.sideicon} />
                        Dashboard
                    </Menu.Item>
                    <Menu.Item onClick={() => this.changeTab('events')} as='a' name='events'>
                        <Icon name='calendar' style={styles.sideicon} />
                        Events
                    </Menu.Item>
                    <Menu.Item onClick={() => this.changeTab('shows')} as='a' name='shows'>
                        <Icon name='film' style={styles.sideicon} />
                        Shows
                    </Menu.Item>
                    <Menu.Item onClick={() => this.changeTab('screens')} as='a' name='screens'>
                        <Icon name='tv' style={styles.sideicon} />
                        Screens
                    </Menu.Item>
                </Sidebar>
                <Sidebar.Pusher style={{
                    position: 'absolute',
                    width: '80%',
                    left: 20,
                    top: 20,
                }}>
                    {loading && <Loader active inline='centered' />}
                    {error && (
                        <Message error>
                            <Message.Header>Error</Message.Header>
                            <p>{error}</p>
                        </Message>
                    )}
                    {this.renderContent(renderTab, data)}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }

    renderContent(tabName, data) {
        switch (tabName) {
            case 'dashboard':
                return <Dashboard />;
            case 'events':
                return <Events data={data} />;
            case 'shows':
                return <Shows />;
            case 'screens':
                return <AddScreen />;
            default:
                return null;
        }
    }
}

export default Admin;