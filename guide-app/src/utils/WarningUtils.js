import { LogBox } from "react-native";

//WARNINGS CAUSED BY PACKAGES, REMOVE LINE/S IF A FUTURE UPDATE RESOLVES ONE OF THESE.
export const ignoreNonImportant = () => {
  LogBox.ignoreLogs([
    "Warning: componentWillMount has been renamed, and is not recommended for use.",
    "Warning: componentWillReceiveProps has been renamed, and is not recommended for use.",
    "Warning: componentWillUpdate has been renamed, and is not recommended for use.",
    "Remote debugger is in a background tab which may cause apps to perform slowly",
    "Require cycle: ../../node_modules/rn-fetch-blob/index.js",
    "Require cycle: ../../node_modules/react-native/Libraries/Network/fetch.js",
    "Require cycle: ../../node_modules/rn-fetch-blob/index.js -> ../../node_modules/rn-fetch-blob/polyfill/index.js -> ../../node_modules/rn-fetch-blob/polyfill/Fetch.js -> ../../node_modules/rn-fetch-blob/index.js",
    "new NativeEventEmitter",
    "new NativeEventEmitter() was called with a non-null argument",
    "new NativeEventEmitter() was called with a non-null argument without the required removeListeners method.",
    "new NativeEventEmitter() was called with a non-null argument without the required removeListeners method.",
    "`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.",
    "`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.",
  ]);
};
