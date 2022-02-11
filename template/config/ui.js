import HomeButton from "@shared-components/BottomBarButton/buttons/HomeButton";
import CalendarButton from "@shared-components/BottomBarButton/buttons/CalendarButton";
import SettingsButton from "@shared-components/BottomBarButton/buttons/SettingsButton";

export const Navigation = {
  bottomBarButtons: [
    { id: "home", ButtonComponent: HomeButton },
    { id: "calendar", ButtonComponent: CalendarButton },
    { id: "settings", ButtonComponent: SettingsButton },
  ],
};
