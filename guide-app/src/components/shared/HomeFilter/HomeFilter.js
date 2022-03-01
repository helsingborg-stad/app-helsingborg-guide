import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TextInput from "@shared-components/TextInput/TextInput";
import DraggableSilder from "@shared-components/DraggableSilder";
import FilterModal from "@shared-components/FilterModal";
import styles from "./style";
import LangService from "@services/langService";
import Colors from "@assets/styles/Colors";


const HomeFilter = (props) => {

  const [distance, setDistance] = useState(3);
  const [dimensions, setDimensions] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const onValueChange = (e) => setDistance(e);

  return (
    <>
      <View
        onLayout={(event) => {
          setDimensions(event.nativeEvent.layout);
        }}
        style={styles.filter}>
        <View style={styles.search}>
          <View style={styles.searchTop}>
            <Text style={styles.searchTopLeft}>{LangService.strings.FILTER_TITLE}</Text>
            <TouchableOpacity
              onPress={() => setShowFilter(true)}
            >
              <Text style={styles.searchTopRight}>{LangService.strings.FILTER}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBottom}>
            <TextInput
              size={"standard"}
              isSearch={true}
              placeholder={LangService.strings.SEARCH_MAIN}
              placeholderTextColor={"#858585"}
              expandable={true}
              autoFocus={false}
              modalDimensions={dimensions}
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
      <FilterModal
        isModalVisible={showFilter}
        setModalVisible={setShowFilter}
        coverScreen={true}
        backdropColor={"white"}
        backdropOpacity={1}
      />
    </>
  );
};


export default HomeFilter;
