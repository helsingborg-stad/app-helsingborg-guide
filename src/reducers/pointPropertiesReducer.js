import { FETCH_POINTPROPERTIES_SUCCESS, FETCH_POINTPROPERTIES_REQUEST, FETCH_POINTPROPERTIES_FAILURE } from "../actions/actionTypes";
import initialState from "./initialState";

export default function pointpropertiesReducer(state = initialState.pointproperties, action) {
  switch (action.type) {
    case FETCH_POINTPROPERTIES_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_POINTPROPERTIES_SUCCESS: {
      // Filter out the data we need
      const items = [];
      action.pointproperties.forEach((element) => {
        const item = {
          id: element.id,
          guideID: action.guideID,
          name: element.name,
          icon: element.icon,
        };
        items.push(item);
      });
      return { ...state, items, isFetching: false };
    }
    case FETCH_POINTPROPERTIES_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
