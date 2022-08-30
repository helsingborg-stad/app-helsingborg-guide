// @flow

import React from "react";
import LinkTouchable from "./LinkTouchable";
import { Linking } from "react-native";
import { trackEvent } from "@utils/MatomoUtils";

type Props = {
  url: string,
  navigation: Object
};

export default function(props: Props) {
  return (
    <LinkTouchable
      title={props.url.replace(/^https?:\/\//, "")}
      onPress={() => {
        trackEvent("open", "open_url", props?.title)
        Linking.openURL(props.url);
      }}
    />
  );
}
