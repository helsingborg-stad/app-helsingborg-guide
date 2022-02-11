import HomeButton from "@shared-components/BottomBarButton/buttons/HomeButton";
import SettingsButton from "@shared-components/BottomBarButton/buttons/SettingsButton";

export const Navigation = {
  bottomBarButtons: [
    { id: "home", ButtonComponent: HomeButton },
    { id: "settings", ButtonComponent: SettingsButton },
  ],
};
