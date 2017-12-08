import { FETCH_NAVIGATION_SUCCESS, FETCH_NAVIGATION_REQUEST, FETCH_NAVIGATION_FAILURE } from "../actions/actionTypes";
import initialState from "./initialState";

function getIdFromHref(href) {
  const split = href.split("/");
  if (split.length > 0) { return Number(split[split.length - 1]); }

  return null;
}

export default function navigationReducer(state = initialState.navigation, action) {
  switch (action.type) {
    case FETCH_NAVIGATION_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_NAVIGATION_SUCCESS: {
      // Filter out the data we need
      const items = [];
      action.navigation.forEach((element) => {
        // TODO remove once the getch includes the ID property
        const guides = element._links.guide.map(item => Object.assign({}, item, { id: getIdFromHref(item.href) }));
        const locations = element._links.guidegroup.map(item => Object.assign({}, item, { id: getIdFromHref(item.href) }));

        const item = {
          id: element.id,
          name: element.name,
          guides,
          locations,
        };
        items.push(item);
      });
      return { ...state, items, isFetching: false };
    }
    case FETCH_NAVIGATION_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
