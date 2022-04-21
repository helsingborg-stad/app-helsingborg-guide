import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Switch } from "react-native-switch";
import Modal from "react-native-modal";
import TextInput from "@shared-components/TextInput/TextInput";
import DraggableSilder from "@shared-components/DraggableSilder";
import FilterModal from "@shared-components/FilterModal";
import styles from "./style";
import LangService from "@services/langService";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowDown from "@assets/images/arrow_down";

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
    setShowButton(navigation.isFocused());
  }, [navigation.isFocused()]);


  useEffect(() => {
    return () => setShowButton(false);
  }, []);

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
        <View style={styles.wrapper}>
          <View style={styles.search}>
            <View style={styles.searchTop}>
              <Text style={styles.searchTopLeft}>{LangService.strings.FILTER_TITLE}</Text>
              {/*<TouchableOpacity*/}
              {/*  onPress={() => setShowFilter(true)}*/}
              {/*>*/}
              {/*  <Text style={styles.searchTopRight}>{LangService.strings.FILTER}</Text>*/}
              {/*</TouchableOpacity>*/}
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
              <View style={styles.forChildren}>
                <Switch
                  value={true}
                  onValueChange={() => null}
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
                    justifyContent: "center"
                  }} // style for inner animated circle for what you (may) be rendering inside the circle
                  outerCircleStyle={{}} // style for outer animated circle
                  renderActiveText={false}
                  renderInActiveText={false}
                  switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                  switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                  switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
                  switchBorderRadius={24} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                />
                <Text style={styles.forChildrenText}>{LangService.strings.FOR_CHILDREN}</Text>
              </View>
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
              sliderHeight={4}
              snapped={true}
            />
            <View style={styles.distanceValues}>
              <Text style={styles.distanceValue}>0 km</Text>
              <Text style={styles.distanceValue}>7 km</Text>
            </View>
          </View>
          {showButton && <Portal>
            <Animated.View style={{ top: settingsHeight ? height : undefined }}>
              <TouchableOpacity
                onPress={toggleOpen}
                style={[styles.toggleSettings, {
                  transform: [{ rotateX: open ? "180deg" : "0deg" }],
                  top: ((segmentLayout || 0) + (insets?.top || 0)) - 15
                }]}>
                <ArrowDown />
              </TouchableOpacity>
            </Animated.View>
          </Portal>
          }
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
