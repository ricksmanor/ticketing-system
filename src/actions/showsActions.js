import axios from 'axios';
import { toast } from 'react-toastify';

const APIURL = "https://ticketbooking-12.appspot.com";
const listshows = '/client/listshows';
const addshow = '/shows/add';
const ctoken = localStorage.getItem('USER_TOKEN');

// Action Types
export const FETCH_SHOWS_REQUEST = 'FETCH_SHOWS_REQUEST';
export const FETCH_SHOWS_SUCCESS = 'FETCH_SHOWS_SUCCESS';
export const FETCH_SHOWS_FAILURE = 'FETCH_SHOWS_FAILURE';
export const ADD_SHOW_SUCCESS = 'ADD_SHOW_SUCCESS';
export const ADD_SHOW_FAILURE = 'ADD_SHOW_FAILURE';

// Fetch Shows Action
export const fetchShows = () => {
    return async (dispatch) => {
        dispatch({ type: FETCH_SHOWS_REQUEST });
        try {
            const response = await axios.get(APIURL + listshows, {
                headers: { 'USER_TOKEN': ctoken }
            });
            dispatch({ type: FETCH_SHOWS_SUCCESS, payload: response.data });
        } catch (error) {
            console.error(error);
            toast.error('Error fetching shows', { position: toast.POSITION.TOP_CENTER });
            dispatch({ type: FETCH_SHOWS_FAILURE, payload: error.message });
        }
    };
};

// Add Show Action
export const addShow = (showData) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(APIURL + addshow, showData, {
                headers: { 'USER_TOKEN': ctoken }
            });
            dispatch({ type: ADD_SHOW_SUCCESS, payload: response.data });
            toast.success('Response: ' + response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                zIndex: 199
            });
            dispatch(fetchShows()); // Refresh the shows list after adding a new show
        } catch (error) {
            console.error(error);
            toast.error('Error submitting show', { position: toast.POSITION.TOP_CENTER });
            dispatch({ type: ADD_SHOW_FAILURE, payload: error.message });
        }
    };
};