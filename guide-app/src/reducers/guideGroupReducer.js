// @flow

const initialState: GuideGroupState = {
  isFetching: false,
  items: [],
  fetchingIds: [],
};

export default function guideGroupReducer(
  state: GuideGroupState = initialState,
  action: Action
): GuideGroupState {
  switch (action.type) {
    case "FETCH_GUIDEGROUPS_REQUEST":
      return {
        ...state,
        isFetching: true,
        fetchingIds: [...state.fetchingIds, ...action.ids],
      };
    case "FETCH_GUIDEGROUPS_SUCCESS": {
      const items = action?.guideGroups?.length ? [...action.guideGroups] : [...state.items];

      // action.guideGroups.forEach(g => {
      //   const index = items.findIndex(item => item.id === g.id);
      //   if (index >= 0) {
      //     // replace
      //     items[index] = g;
      //   } else {
      //     // push
      //     items.push(g);
      //   }
      // });

      const remainingIds = state.fetchingIds.filter(
        id => !action.ids.includes(id)
      );

      return {
        ...state,
        items,
        isFetching: remainingIds.length > 0,
        fetchingIds: remainingIds,
      };
    }
    case "FETCH_GUIDEGROUPS_FAILURE":
      const remainingIds = state.fetchingIds.filter(
        id => !action.ids.includes(id)
      );

      return {
        ...state,
        isFetching: remainingIds.length > 0,
        fetchingIds: remainingIds,
      };
    case "SET_GUIDES_AND_GUIDEGROUPS":
      return {
        ...state,
        items: action.guideGroups,
      };
    default:
      return state;
  }
}
