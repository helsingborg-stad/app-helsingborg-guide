import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { throttle } from "lodash/function";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Scrollable = (props) => {
  const { children, style, contentContainerStyle, refreshControl, refreshAction } = props;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Throtteling to prevent spamming

  useEffect(() => {
    if (refreshing && !!refreshAction) {
      throttle(() => {
        refreshAction()
      }, 2000)();
    }
  }, [refreshing]);

  // Cleanup on unmount

  useEffect(() => {
    return setRefreshing(false);
  }, []);


  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      {...(refreshControl ? {
        refreshControl:
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />,
      } : {})}
    >
      {children}
    </ScrollView>
  );
};

export default Scrollable;
