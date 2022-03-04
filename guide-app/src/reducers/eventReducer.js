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
      console.log("FETCHING")
      // TODO: Group by date?
      // If we want to save state per date and not have to re-fetch every time we switch the date
      // we should group the events by date in state for easier accessing
      //
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

      const items = [...action.events];


      return { ...state, items, isFetching: false };
    }
    case "FETCH_EVENTS_FAILURE":
      return { ...state, isFetching: false, items: [] };
    default:
      return state;
  }
}
