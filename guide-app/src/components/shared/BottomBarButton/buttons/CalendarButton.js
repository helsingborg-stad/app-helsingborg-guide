import React from "react";
import BottomBarButton from "@shared-components/BottomBarButton";
import Calendar from "@shared-components/svg/calendar";
import LangService from "@services/langService";
import * as navigation from "@utils/NavigationUtils";

type Props = {
  selected: boolean,
  onPress(): void,
};

const CalendarButton = ({ onPress, selected }: Props) => (
  <BottomBarButton
    label={LangService.strings.CALENDAR}
    Icon={Calendar}
    selected={selected}
    onPress={() => {
      !selected &&
        navigation.reset({
          index: 0,
          routes: [{ name: "CalendarScreen" }],
        });
      onPress();
    }}
  />
);

export default CalendarButton;
