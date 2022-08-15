import React from "react";
import BottomBarButton from "@shared-components/BottomBarButton";
import QRIcon from "@shared-components/svg/qr";
import LangService from "@services/langService";
import useOpenLink from "@hooks/useOpenLink";
import * as navigation from "@utils/NavigationUtils";

type Props = {
  selected: boolean,
  onPress(): void,
};

const QRButton = ({ onPress, selected }: Props) => {

  const { openLink } = useOpenLink();

  return (
    <BottomBarButton
      label={LangService.strings.SCAN}
      Icon={QRIcon}
      selected={selected}
      onPress={() => {
        !selected && navigation.navigate("ScanScreen");
          onPress();
      }}
    />
  );
};

export default QRButton;
