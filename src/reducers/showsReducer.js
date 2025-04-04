import {
    FETCH_SHOWS_REQUEST,
    FETCH_SHOWS_SUCCESS,
    FETCH_SHOWS_FAILURE,
    ADD_SHOW_SUCCESS,
    ADD_SHOW_FAILURE
} from '../actions/showsActions';

const initialState = {
    showData: [],
    loading: false,
    error: null,
};

const showsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SHOWS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_SHOWS_SUCCESS:
            return { ...state, loading: false, showData: action.payload };
        case FETCH_SHOWS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADD_SHOW_SUCCESS:
            return { ...state }; // You can handle additional logic if needed
        case ADD_SHOW_FAILURE:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default showsReducer;