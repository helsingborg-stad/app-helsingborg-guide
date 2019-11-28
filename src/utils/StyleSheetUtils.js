import { StyleSheet } from "react-native";

function flatten(style: any): Object {
  return StyleSheet.flatten(style);
}

export default {
  concat: (...args: any[]) => {
    let result = [];
    args.forEach(arg => {
      if (arg) {
        const type = typeof arg;
        if (Array.isArray(arg)) {
          result = result.concat(arg);
        } else if (type === "object" || type === "number") {
          result.push(arg);
        } else {
          throw new Error(`Unexpected type: ${typeof arg}`);
        }
      }
    });
    return result;
  },

  flatten
};
