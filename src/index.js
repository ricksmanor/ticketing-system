import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import rootReducer from './reducers/showsReducer'; // Assuming you have a rootReducer in reducers/index.js
import Shows from './components/Shows'; // Adjust the path as necessary
import './index.css'; // Your global styles

// Create Redux store with middleware
const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

const App = () => (
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact path="/" component={Shows} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));