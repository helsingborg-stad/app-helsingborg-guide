import React from "react";
import BottomBarButton from "@shared-components/BottomBarButton";
import Settings from "@shared-components/svg/settings";
import LangService from "@services/langService";
import * as navigation from "@utils/NavigationUtils";

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
      !selected && navigation.reset({
        index: 0,
        routes: [
          { name: "SettingsScreen" }
        ]
      });
      onPress();
    }}
  />
);

export default SettingsButton;
