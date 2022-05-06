import React, { useState, useEffect } from "react";
import { Linking } from "react-native";
import { throttle } from "lodash/function";

const useMount = func => useEffect(() => func(), []);

const useInitialURL = () => {
  const [url, setUrl] = useState("");

  const getForegroundURL = (foregroundURL) => {
    setUrl(foregroundURL.url || url);
  }


  useMount(() => {
    Linking.addEventListener("url", getForegroundURL);
    const getBackgroundURL = async () => {
      const initialUrl = await Linking.getInitialURL();
        setUrl(initialUrl);
    };
    getBackgroundURL();
  });

  useEffect(() => {
    // throttle(() => {
    //     url && setUrl("");
    // },2000)
  },[url])

  return { url };
};

export default useInitialURL;
