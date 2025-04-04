import React, { Component } from 'react';
import axios from 'axios';
import { Button, Grid, Divider, Input, Label, Form, FormField } from 'semantic-ui-react';
import config from 'react-global-configuration';
import Categories from './Categories';

/* ................................ 
............Billing class ............
..................................*/

class Billing extends Component {
    render() {
        return (
            <Grid columns={3}>
                <Grid.Column textAlign='center'>
                    Seats selected: {this.props.number_of_seats}
                </Grid.Column>
                <Grid.Column textAlign='center'>
                    <Button negative disabled={!this.props.number_of_seats} onClick={this.props.onClick}>CANCEL</Button>
                </Grid.Column>
            </Grid>
        );
    }
}

/* ................................ ..............
............Submit class .....................
......Submit user's choice of seats to server.......
................................................*/

class Submit extends Component {
    constructor(props) {
        super(props);
        this.sendDetails = this.sendDetails.bind(this);
    }

    render() {
        return (
            <Grid.Row centered>
                <Button positive onClick={() => this.sendDetails("buyseat")} disabled={!this.props.value.length}>Buy</Button>
                <Button color="yellow" onClick={() => this.sendDetails("bookseat")} disabled={!this.props.value.length}>Book</Button>
            </Grid.Row>
        );
    }

    sendDetails(purchaseType) {
        axios.post(config.get('base_url') + this.props.url + '/' + purchaseType, { "seat_no": this.props.value }, { headers: { 'USER_TOKEN': localStorage.getItem('USER_TOKEN') } })
            .then(response => {
                console.log(response.status);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

/* ................................ 
............Seat class ............
..................................*/

class Seat extends Component {
    render() {
        return (
            <Button
                icon
                inverted
                color={this.props.status === 2 ? "green" : "grey"}
                disabled={this.props.status === 3}
                onClick={this.props.onClick}
            />
        );
    }
}

/* ................................ 
.........Screen layout class ...........
..................................*/

class AddScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            max_rows: null,
            max_columns: null,
            seats: {},
            categories: [],
            categoryMap: {},
            selected: [],
            name: '',
            location: ''
        };

        this.handleSeatClicks = this.handleSeatClicks.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    createTable = (row, column) => {
        let table = [];

        for (let i = 0; i < row; i++) {
            let children = [];
            for (let j = 0; j < column; j++) {
                const seatKey = (i + 1).toString() + "-" + (j + 1).toString();
                children.push(
                    <td key={seatKey}>
                        <Seat
                            status={this.state.seats[seatKey] || 0}
                            onClick={() => this.handleSeatClicks(seatKey)}
                        />
                    </td>
                );
            }
            table.push(<tr key={i}>{children}</tr>);
        }
        return table;
    }

    handleSeatClicks(key) {
        let newState = { ...this.state };
        if (newState.seats[key] === 2) {
            // If already selected, deselect it
            newState.seats[key] = 0;
            newState.selected = newState.selected.filter(seat => seat !== key);
        } else {
            // Select the seat
            newState.seats[key] = 2;
            newState.selected.push(key);
        }
        this.setState(newState);
    }

    onCancelClick() {
        let newState = { ...this.state };
        this.state.selected.forEach(key => {
            newState.seats[key] = 0; // Reset seat status
        });
        newState.selected = []; // Clear selected seats
        this.setState(newState);
    }

    handleChange(e, { name, value }) {
        this.setState({ [name]: value });
    }

    submitScreen = () => {
        const payload = {
            name: this.state.name,
            location: this.state.location,
            max_rows: parseInt(this.state.max_rows),
            max_columns: parseInt(this.state.max_columns),
        };

        let categories = this.state.categories.slice();
        for (let i in this.state.categories) {
            categories[i].seats = this.state.categoryMap[i].seats;
        }

        payload.categories = categories;

        axios.post(config.get('base_url') + this.props.url, payload, { headers: { 'USER_TOKEN': localStorage.getItem('USER_TOKEN') } })
            .then(response => {
                console.log(response.data);
                // Handle success (e.g., show a success message, redirect, etc.)
            })
            .catch(error => {
                console.error("There was an error submitting the screen!", error);
                // Handle error (e.g., show an error message)
            });
    }

    render() {
        const { max_rows, max_columns, selected } = this.state;

        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormField>
                        <Label>Name</Label>
                        <Input name='name' onChange={this.handleChange} />
                    </FormField>
                    <FormField>
                        <Label>Location</Label>
                        <Input name='location' onChange={this.handleChange} />
                    </FormField>
                    <FormField>
                        <Label>Max Rows</Label>
                        <Input type='number' name='max_rows' onChange={this.handleChange} />
                    </FormField>
                    <FormField>
                        <Label>Max Columns</Label>
                        <Input type='number' name='max_columns' onChange={this.handleChange} />
                    </FormField>
                    <Button type='submit'>Submit</Button>
                </Form>

                <Divider />

                <table>
                    <tbody>
                        {this.createTable(max_rows, max_columns)}
                    </tbody>
                </table>

                <Divider />

                <Billing number_of_seats={selected.length} onClick={this.onCancelClick} />
                <Submit value={selected} url={this.props.url} />
            </div>
        );
    }
}

export default AddScreen;