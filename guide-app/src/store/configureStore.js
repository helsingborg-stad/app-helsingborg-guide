import AsyncStorage from "@react-native-async-storage/async-storage";
import { compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import reducers from "@src/reducers";
import offlineDataMiddleware from "@src/middleware/offlineDataMiddleware";
import audioMiddleware from "@src/middleware/audioMiddleware";
import navigationMiddleware from "@src/middleware/navigationMiddleware";
import patchContentMiddleware from "@src/middleware/patchContentMiddleware";

const config = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [
    "error",
    "menu",
    "internet",
    "audio",
    "uiState",
    "quiz",
    "hasLocationStatus",
    "events",
    "geolocation",
  ],
  version: 1,
  debug: __DEV__,
  stateReconciler: autoMergeLevel2,
};

// "guides", "guideGroups", "navigation"

const reducer = persistReducer(config, reducers);

const middlewares = [
  patchContentMiddleware,
  offlineDataMiddleware,
  audioMiddleware,
  navigationMiddleware,
  thunk,
];

if (__DEV__) {
  // Middlewares used only in debug
  middlewares.push(reduxImmutableStateInvariant());
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
  reducer: reducer,
  middleware: middlewares,
  enhancers: [composeEnhancers],
  devTools: __DEV__,
});

export default store;

