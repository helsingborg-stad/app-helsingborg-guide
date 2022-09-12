import AsyncStorage from "@react-native-async-storage/async-storage";

const useLocalStorage = () => {
  const parseData = (data) => {
    try {
      JSON.parse(data);
    } catch (e) {
      return data;
    }
    return JSON.parse(data);
  };

  const setLocalStorage = (key, data) => {
    let storedData = typeof data === "string" ? data : JSON.stringify(data);
    AsyncStorage.setItem(key, storedData).catch(() => {});
  };

  const getLocalStorage = (key) => {
    return AsyncStorage.getItem(key)
      .then((data) => {
        return parseData(data);
      })
      .catch((err) => {
        console.log("ASYNC_STORAGE_GET_ERROR", err);
      });
  };

  const removeLocalStorage = (key) => {
    AsyncStorage.removeItem(key).catch((err) => {
      console.log("ASYNC_STORAGE_REMOVE_ERROR", err);
    });
  };

  return { setLocalStorage, getLocalStorage, removeLocalStorage };
};

export default useLocalStorage;
