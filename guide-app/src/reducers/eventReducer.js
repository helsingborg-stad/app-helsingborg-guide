// @flow

const initialState: EventState = {
  isFetching: false,
  items: []
};

export default function eventReducer(
  state: EventState = initialState,
  action: Action
): EventState {
  switch (action.type) {
    case "FETCH_EVENTS_REQUEST":
      return { ...state, isFetching: true };
    case "FETCH_EVENTS_SUCCESS": {
      const items = [...action.events];
      // const items = [...state.items];
      // TODO: GROUP BY DATE?
      // action.events.forEach(g => {
      //   const index = items.findIndex(item => item.id === g.id);
      //   if (index >= 0) {
      //     // replace
      //     items[index] = g;
      //   } else {
      //     // push
      //     items.push(g);
      //   }
      // });
      return { ...state, items, isFetching: false };
    }
    case "FETCH_EVENTS_FAILURE":
      return { ...state, isFetching: false, items: [] };
    default:
      return state;
  }
}
