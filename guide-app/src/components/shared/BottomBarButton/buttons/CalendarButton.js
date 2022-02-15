import React from "react";
import BottomBarButton from "@shared-components/BottomBarButton";
import Calendar from "@shared-components/svg/calendar";
import LangService from "@services/langService";
import NavigatorService from "@services/navigationService";

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
      !selected && NavigatorService.reset("CalendarScreen");
      onPress();
    }}
  />
);

export default CalendarButton;
