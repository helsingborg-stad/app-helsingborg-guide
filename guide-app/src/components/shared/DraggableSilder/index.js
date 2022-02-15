import React, { useState } from "react";
import { ScrollView, View, Dimensions, Text } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomLabel from "./CustomLabel";
import styles from "./style";


const DraggableSilder = (props) => {
  const { values, min, max, onValueChange, selectedSliderColor, unSelectedSliderColor, sliderHeight, snapped} = props;
  const [label, setLabel] = useState(false);
  const setEnableLabel = () => setLabel(true);
  const setDisableLabel = () => setLabel(false);

  return (
    <View style={styles.container}>
      <MultiSlider
        sliderLength={Dimensions.get("window").width - 32}
        onValuesChangeStart={setEnableLabel}
        onValuesChangeFinish={setDisableLabel}
        values={values}
        min={min}
        max={max}
        onValuesChange={onValueChange}
        enableLabel={!!(label)}
        snapped={!!(snapped)}
        markerOffsetY={sliderHeight / 2}
        selectedStyle={{
          flexDirection: "row",
          alignItems: "center",
          height: sliderHeight || 2,
          ...(selectedSliderColor && {backgroundColor: selectedSliderColor, borderRadius: sliderHeight,}),
        }}
        unselectedStyle={{
          flexDirection: "row",
          alignItems: "center",
          height: sliderHeight || 2,
          ...(unSelectedSliderColor && {backgroundColor: unSelectedSliderColor, borderRadius: sliderHeight}),
        }}
        customMarker={(e) => {
          return (
            <View style={styles.marker} />
          )
        }}
        customLabel={(e) => {
          return (
            <CustomLabel {...e} />
          )
        }}
      />
    </View>
  );

};

export default DraggableSilder;
