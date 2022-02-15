import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import TextInput from "@shared-components/TextInput/TextInput";
import DraggableSilder from "@shared-components/DraggableSilder";
import styles from "./style";
import LangService from "@services/langService";
import Colors from "@assets/styles/Colors";


const HomeFilter = (props) => {

  const [distance, setDistance] = useState(3);


  const onValueChange = (e) => setDistance(e)

  return (
    <View style={styles.filter}>
      <View style={styles.search}>
        <View style={styles.searchTop}>
          <Text style={styles.searchTopLeft}>{LangService.strings.FILTER_TITLE}</Text>
          <Text style={styles.searchTopRight}>{LangService.strings.FILTER}</Text>
        </View>
        <View style={styles.searchBottom}>
          <TextInput
            size={"standard"}
            isSearch={true}
            placeholder={LangService.strings.SEARCH_MAIN}
            placeholderTextColor={"#858585"}
            expandable={true}
          />
        </View>
      </View>
      <View style={styles.distance}>
        <Text style={styles.distanceText}>{LangService.strings.DISTANCE}</Text>
          <DraggableSilder
            values={[distance]}
            min={0}
            max={7}
            initialValue={distance}
            onValueChange={onValueChange}
            enableLabel={true}
            selectedSliderColor={"#A71580"}
            unSelectedSliderColor={"#E7E7E7"}
            sliderHeight={4.2}
            snapped={true}
          />
      </View>
    </View>
  )
}


export default HomeFilter;
