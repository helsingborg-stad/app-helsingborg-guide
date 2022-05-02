import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { throttle } from "lodash/function";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Scrollable = (props) => {
  const { children, style, contentContainerStyle, refreshControl, refreshAction, onScroll } = props;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Throtteling to prevent spamming

  useEffect(() => {
    let isMounted = true;
    console.log("IS MOUNTED", isMounted, refreshing, !!refreshAction)
    if (refreshing && !!refreshAction) {
      throttle(() => {
        isMounted && refreshAction();
      }, 2000)();
    }
    return () => {
      setRefreshing(false);
      isMounted = false;
    };
  }, [refreshing]);

  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      scrollEventThrottle={0}
      onScroll={(e) => onScroll && onScroll(e)}
      {...(refreshControl ? {
        refreshControl:
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
      } : {})}
    >
      {children}
    </ScrollView>
  );
};

export default Scrollable;
