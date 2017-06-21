import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function menuReducer(state = initialState. menu, action) {
   
    switch (action.type) {
        case types.OPEN_MENU:
            return {visible:true};
        case types.CLOSE_MENU:
            return {visible:false};
        case types.TOGGLE_MENU:
            return {visible:!state.visible};
        default:
            return state;

    }
}
