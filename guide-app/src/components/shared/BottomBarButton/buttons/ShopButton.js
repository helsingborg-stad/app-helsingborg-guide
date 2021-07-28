import React from "react";
import BottomBarButton from "@shared-components/BottomBarButton";
import ShopIcon from "@shared-components/svg/shop";
import LangService from "@services/langService";
import { webShopUrl } from "@data/urls";
import { Linking } from "react-native";

type Props = {
  selected: boolean,
  onPress(): void,
};

const ShopButton = ({ selected }: Props) => (
  <BottomBarButton
    label={LangService.strings.SHOP}
    Icon={ShopIcon}
    selected={selected}
    onPress={() => {
      Linking.openURL(webShopUrl);
    }}
  />
);

export default ShopButton;
