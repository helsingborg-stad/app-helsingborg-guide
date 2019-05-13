// @flow

import { StackActions, NavigationActions } from "react-navigation";
import type { NavigationParams, NavigationRoute } from "react-navigation";

let _container; // eslint-disable-line

function setContainer(container: Object) {
  _container = container;
}

function reset(routeName: string, params?: NavigationParams) {
  _container.dispatch(
    StackActions.reset({
      index: 0,
      key: undefined, // Required to route from the root navigator (see: https://github.com/react-navigation/react-navigation/issues/5706#issuecomment-482246719)
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    }),
  );
}

function navigate(routeName: string, params?: NavigationParams) {
  _container.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function getCurrentRoute(): NavigationRoute | null {
  if (!_container || !_container.state.nav) {
    return null;
  }

  return _container.state.nav.routes[_container.state.nav.index] || null;
}

export default {
  setContainer,
  navigate,
  reset,
  getCurrentRoute,
};
