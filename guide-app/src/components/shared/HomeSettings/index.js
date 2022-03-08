import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import Modal from "react-native-modal";
import TextInput from "@shared-components/TextInput/TextInput";
import DraggableSilder from "@shared-components/DraggableSilder";
import FilterModal from "@shared-components/FilterModal";
import styles from "./style";
import LangService from "@services/langService";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowUp from "@assets/images/arrow_up";

const HomeSettings = (props) => {

  const { navigation, segmentLayout, open, setOpen, settingsHeight, setSettingsHeight } = props;

  const [distance, setDistance] = useState(3);
  const [showFilter, setShowFilter] = useState(false);
  const [height] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();
  const [showButton, setShowButton] = useState(false);

  const onValueChange = (e) => setDistance(e);


  const initialLoad = (layout) => {
    setSettingsHeight(layout?.height);
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    Animated.timing(height, {
      toValue: open ? settingsHeight : 0,
      duration: 250,
      useNativeDriver: false
    }).start();
  }, [open]);

  useEffect(() => {
    console.log("rövhål", navigation.isFocused())
      setShowButton(navigation.isFocused());
  },[navigation.isFocused()])




  return (
    <>
      <Animated.View
        onLayout={(event) => {
          !settingsHeight && event?.nativeEvent?.layout?.height && initialLoad(event?.nativeEvent?.layout);
        }}
        style={[styles.settings, {
          marginTop: segmentLayout || 0,
          zIndex: 1,
          height: settingsHeight ? height : undefined,
          visibility: settingsHeight ? "visible" : "hidden",
          opacity: settingsHeight ? 1 : 0
        }]}>
        <View>
          <View style={styles.search}>
            <View style={styles.searchTop}>
              <Text style={styles.searchTopLeft}>{LangService.strings.FILTER_TITLE}</Text>
              <TouchableOpacity
                onPress={() => setShowFilter(true)}
              >
                <Text style={styles.searchTopRight}>{LangService.strings.FILTER}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.searchBottom]}>
              <TextInput
                size={"standard"}
                isSearch={true}
                placeholder={LangService.strings.SEARCH_MAIN}
                placeholderTextColor={"#858585"}
                expandable={true}
                autoFocus={false}
                modalDimensions={settingsHeight}
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
          {showButton && <Portal>
            <Animated.View style={{top: settingsHeight ? height : undefined,}}>
              <TouchableOpacity
                onPress={toggleOpen}
                style={[styles.toggleSettings, { transform: [{rotateX: settingsHeight ? "0deg" : "180deg"}], top: ((segmentLayout || 0) + (insets?.top || 0)) - 15 }]}>
                <ArrowUp style={{transform: [{rotateX: open ? "0deg" : "180deg"}]}} />
              </TouchableOpacity>
            </Animated.View>
          </Portal>}
        </View>
      </Animated.View>
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


export default HomeSettings;
