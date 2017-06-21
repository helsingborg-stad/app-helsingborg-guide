import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function geolocationReducer(state = initialState.position, action) {
   
    switch (action.type) {
        case types.GEOLOCATION_UPDATE_SUCCESS:
            return action.position;
        default:
            return state;

    }
}
