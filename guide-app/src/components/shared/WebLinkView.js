// @flow

import React from "react";
import LinkTouchable from "./LinkTouchable";
import { AnalyticsUtils } from "@utils";
import useOpenLink from "@hooks/useOpenLink";
import { Linking } from "react-native";
import { trackEvent } from "@utils/MatomoUtils";

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
  const { openLink } = useOpenLink();
  const webLink = (
    <LinkTouchable
      title={props.url.replace(/^https?:\/\//, "")}
      onPress={() => {
        // openLink(props.url);
        trackEvent("open", "open_url", props?.title, props?.title, props.url)
        Linking.openURL(props.url);
      }}
    />
  );

  return webLink;
}
