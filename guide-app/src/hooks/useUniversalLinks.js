import React, { useState, useEffect } from "react";
import { Linking } from "react-native";
import { throttle } from "lodash/function";

const useMount = func => useEffect(() => func(), []);

const useInitialURL = () => {
  const [url, setUrl] = useState("");

  const getForegroundURL = (foregroundURL) => {
    setUrl((foregroundURL.url || url).replace(/\#.*$/, ""));
  }


  useMount(() => {
    Linking.addEventListener("url", getForegroundURL);
    const getBackgroundURL = async () => {
      const initialUrl = await Linking.getInitialURL();
       initialUrl && setUrl(initialUrl.replace(/\#.*$/, ""));
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
