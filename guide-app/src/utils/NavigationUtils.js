import { createNavigationContainerRef } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function reset(obj) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.reset(obj));
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack());
  }
}

export function currentRouteName() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute().name;
  }
}
