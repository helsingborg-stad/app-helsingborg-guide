import React from "react";
import BottomBarButton from "@shared-components/BottomBarButton";
import ShopIcon from "@shared-components/svg/shop";
import LangService from "@services/langService";
import useOpenLink from "@hooks/useOpenLink";
import NavigatorService from "@services/navigationService";


type Props = {
  selected: boolean,
  onPress(): void,
};

const QRButton = ({ onPress, selected }: Props) => {
  const { openLink } = useOpenLink();

  return (
    <BottomBarButton
      label={LangService.strings.SCAN}
      Icon={ShopIcon}
      selected={selected}
      onPress={() => {
        !selected && NavigatorService.navigate("ScanScreen");
          onPress();
      }}
    />
  );
};

export default QRButton;
