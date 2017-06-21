import * as types from './actionTypes';


export function openMenu() {
    return { type: types.OPEN_MENU};
}

export function closeMenu() {
    return { type: types.CLOSE_MENU};
}

export function toggleMenu() {
    return { type: types.TOGGLE_MENU};
}
