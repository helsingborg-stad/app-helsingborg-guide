import { createStore, compose, applyMiddleware } from "redux";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { AsyncStorage } from "react-native";
import rootReducer from "../reducers/index";

const config = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["error", "menu", "internet", "audio"],
};

const reducer = persistReducer(config, rootReducer);

function configureStoreProd(initialState) {
  const middlewares = [
    // Add other middleware on this line...

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
  ];

  return createStore(reducer, initialState, compose(applyMiddleware(...middlewares)));
}

function configureStoreDev(initialState) {
  const middlewares = [
    // Add other middleware on this line...

    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant(),

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../reducers", () => {
      const nextReducer = require("../reducers").default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === "production" ? configureStoreProd : configureStoreDev;

const store = configureStore();

// begin periodically persisting the store
persistStore(store);

export default store;
