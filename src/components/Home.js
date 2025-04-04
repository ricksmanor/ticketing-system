import React, { Component } from 'react';
import '../App.css';
import Main from './Frontpage/Main';
import Admin from './Admin';
import Login from './Login';
import User from './User /User';
import UserRegister from './User /UserRegister';
import Header from './Header';
import Dashboard from './Dashboard';
import axios from 'axios';
import EventDetail from './Events/EventDetail';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import AddScreen from './Admin/AddScreen';
import ClientRegister from './Admin/ClientRegister';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            loading: true, // New loading state
            error: null, // New error state
        };
    }

    componentDidMount() {
        this.loginCheck();
    }

    loginCheck() {
        console.log("Checking login status...");
        if (localStorage.getItem('USER_TOKEN')) {
            this.setState({ loggedIn: true, loading: false });
        } else {
            this.setState({ loggedIn: false, loading: false });
        }
    }

    handleLogout = () => {
        localStorage.removeItem('USER_TOKEN');
        this.setState({ loggedIn: false });
    }

    render() {
        const { loggedIn, loading } = this.state;

        if (loading) {
            return <div>Loading...</div>; // Show loading state
        }

        return (
            <div>
                <Header loggedIn={loggedIn} onLogout={this.handleLogout} />
                <Switch>
                    <Route exact path='/' component={Main} />
                    <Route path='/events/:event_id/shows' component={EventDetail} />
                    <Route path='/login' render={(props) => <Login {...props} loggedIn={loggedIn} />} />
                    <Route path='/admin' component={Admin} />
                    <Route path='/register/user/' component={UserRegister} />
                    <Route path='/register/client/:token' component={ClientRegister} />
                    <Route path='/profile/' component={User } />
                    <Route path='/screens/add' component={AddScreen} />
                    <Redirect to='/' />
                </Switch>
            </div>
        );
    }
}

export default Home;