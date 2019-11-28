// @flow

import React from "react";
import LinkTouchable from "./LinkTouchable";
import { AnalyticsUtils } from "../../utils/";

function goToLink(url: string, title: string, navigation: Object) {
  const { navigate } = navigation;
  AnalyticsUtils.logEvent("open_url", { title });
  navigate("WebScreen", { url });
}

type Props = {
  url: string,
  navigation: Object
};

export default function(props: Props) {
  const webLink = (
    <LinkTouchable
      title={props.url.replace(/^https?:\/\//, "")}
      onPress={() => {
        goToLink(props.url, props.url, props.navigation);
      }}
    />
  );

  return webLink;
}
