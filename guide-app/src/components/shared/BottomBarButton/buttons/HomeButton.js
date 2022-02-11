import React from "react";
import BottomBarButton from "@shared-components/BottomBarButton";
import Home from "@shared-components/svg/home";
import LangService from "@services/langService";
import NavigatorService from "@services/navigationService";

type Props = {
  selected: boolean,
  onPress(): void,
};

const HomeButton = ({ onPress, selected }: Props) => (
  <BottomBarButton
    label={LangService.strings.HOME}
    Icon={Home}
    selected={selected}
    onPress={() => {
      !selected && NavigatorService.reset("HomeScreen");
      onPress();
    }}
  />
);

export default HomeButton;
