import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ShowsList from './ShowsList';
import App from './App';
import config from 'react-global-configuration';

class EventDetail extends Component {
    render() {
        return (
            <div>
                <Switch>
                    {/* Route for the list of shows */}
                    <Route exact path={this.props.match.path} component={ShowsList} />
                    
                    {/* Route for individual show details */}
                    <Route path={`${this.props.match.url}/:show_id`} component={App} />
                </Switch>
            </div>
        );
    }
}

export default EventDetail;