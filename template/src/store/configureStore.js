import AsyncStorage from "@react-native-community/async-storage";
import { createStore, applyMiddleware, compose } from "redux";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";
import { persistStore, persistCombineReducers } from "redux-persist";
import reducers from "@src/reducers";
import offlineDataMiddleware from "@src/middleware/offlineDataMiddleware";
import audioMiddleware from "@src/middleware/audioMiddleware";
import navigationMiddleware from "@src/middleware/navigationMiddleware";
import patchContentMiddleware from "@src/middleware/patchContentMiddleware";

const config = {
  key: "hbgRoot",
  storage: AsyncStorage,
  blacklist: ["error", "menu", "internet", "audio", "uiState"],
  version: 1,
  debug: __DEV__
};

const reducer = persistCombineReducers(config, reducers);

const middlewares = [
  patchContentMiddleware,
  offlineDataMiddleware,
  audioMiddleware,
  navigationMiddleware,
  thunk
];

if (__DEV__) {
  // Middlewares used only in debug
  middlewares.push(reduxImmutableStateInvariant());
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  const persistor = persistStore(store);

  return {
    store,
    persistor
  };
}
