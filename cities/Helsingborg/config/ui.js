import HomeButton from "@shared-components/BottomBarButton/buttons/HomeButton";
import CalendarButton from "@shared-components/BottomBarButton/buttons/CalendarButton";
import SettingsButton from "@shared-components/BottomBarButton/buttons/SettingsButton";
import ShopButton from "@shared-components/BottomBarButton/buttons/ShopButton";
import QRButton from "@shared-components/BottomBarButton/buttons/QRButton";

export const Navigation = {
  bottomBarButtons: [
    { id: "home", ButtonComponent: HomeButton },
    { id: "calendar", ButtonComponent: CalendarButton },
    { id: "settings", ButtonComponent: SettingsButton },
    // { id: "shop", ButtonComponent: ShopButton },
    { id: "qr", ButtonComponent: QRButton },
  ],
};

