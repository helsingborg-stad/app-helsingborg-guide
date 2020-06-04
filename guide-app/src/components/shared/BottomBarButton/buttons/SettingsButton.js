import React from "react";
import BottomBarButton from "@shared-components/BottomBarButton";
import Settings from "@shared-components/svg/settings";
import LangService from "@services/langService";
import NavigatorService from "@services/navigationService";

type Props = {
  selected: boolean,
  onPress(): void,
};

const SettingsButton = ({ onPress, selected }: Props) => (
  <BottomBarButton
    label={LangService.strings.SETTINGS}
    Icon={Settings}
    selected={selected}
    onPress={() => {
      NavigatorService.reset("SettingsScreen");
      onPress();
    }}
  />
);

export default SettingsButton;
