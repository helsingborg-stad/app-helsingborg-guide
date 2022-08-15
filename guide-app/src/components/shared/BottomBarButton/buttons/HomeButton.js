import React from "react";
import BottomBarButton from "@shared-components/BottomBarButton";
import Home from "@shared-components/svg/home";
import LangService from "@services/langService";
import * as navigation from "@utils/NavigationUtils";

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
      !selected &&
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        });
      onPress();
    }}
  />
);

export default HomeButton;
