import React, { useState } from "react";
import { View, Text } from "react-native";
import { Switch } from "react-native-switch";
import LangService from "@services/langService";
import styles from "./style";

const options = {
  left: [
    "FOR_CHILDREN",
    "ACCESSIBLE",
    "ANIMALS_ALLOWED",
    "FOR_ADULTS",
    "PARKING",
  ],
  right: [
    "INDOOR",
    "OUTDOOR",
  ],
};


const Details = () => {

  const [selected, setSelected] = useState([]);

  const onValueChange = (option) => {
    const copy = [...selected];
    !copy.includes(option) ? copy.push(option) : copy.splice(copy.indexOf(option), 1);
    setSelected(copy);
  };

  const renderSwitch = (option, index) => (
    <View key={index} style={styles.switch}>
      <Switch
        value={selected.includes(option)}
        onValueChange={() => onValueChange(option, index)}
        circleSize={24}
        barHeight={24}
        circleBorderWidth={2}
        circleBorderActiveColor={"#A40082"}
        circleBorderInactiveColor={"#ececec"}
        backgroundActive={"#A40082"}
        backgroundInactive={"#ececec"}
        circleActiveColor={"#FFFFFF"}
        circleInActiveColor={"#FFFFFF"}
        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
        innerCircleStyle={{
          alignItems: "center",
          justifyContent: "center",
        }} // style for inner animated circle for what you (may) be rendering inside the circle
        outerCircleStyle={{}} // style for outer animated circle
        renderActiveText={false}
        renderInActiveText={false}
        switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
        switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
        switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
        switchBorderRadius={24} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
      />
      <Text style={[styles.switchText, selected.includes(option) && styles.bold]}>{LangService.strings[option]}</Text>
    </View>
  );

  return (
    <View style={styles.details}>
      <View style={styles.detailsLeft}>
        {options.left.map((option, index) => (
          renderSwitch(option, index)
        ))}
      </View>
      <View style={styles.detailsRight}>
        {options.right.map((option, index) => (
          renderSwitch(option, index)
        ))}
      </View>
    </View>
  );
};

export default Details;
