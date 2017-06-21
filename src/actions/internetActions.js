import * as types from './actionTypes';


export function internetChanged(connected) {
    return { type: types.INTERNET_CHANGED, internet:{connected} };
}
