import React, { useState, useEffect, memo } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash/function";
import TextInput from "@shared-components/TextInput/TextInput";
import DraggableSilder from "@shared-components/DraggableSilder";
import styles from "./style";
import LangService from "@services/langService";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowDown from "@assets/images/arrow_down";
import { setSearchFilter, setShowHomeSettings, setSettingsHeight } from "@actions/uiStateActions";

const HomeSettings = (props) => {

  const { segmentLayout } = props;

  const dispatch = useDispatch();
  const [distance, setDistance] = useState([3]);
  const [displayShadow, setDisplayShadow] = useState(false);
  const [height] = useState(new Animated.Value(0));
  const [backdropOpacity] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();
  const { searchFilter, showFilterButton, showHomeSettings, settingsHeight } = useSelector(s => s.uiState);
  const [searchText, setSearchText] = useState(searchFilter?.text || "");
  const minKm = 0.1;
  const maxKm = 3;
  const step = 0.1;

  const onDistanceChange = debounce((e) => {
    setDistance(e);
    dispatch(setSearchFilter({ distance: e[0] }));
  }, 800);

  const onTextChange = debounce((e) => {
    dispatch(setSearchFilter({ text: e.length >= 3 ? e : "" }));
  }, 800);

  const initialLoad = (layout) => {
    dispatch(setSettingsHeight(layout?.height));
    dispatch(setShowHomeSettings(true));
  };

  const toggleOpen = () => {
    dispatch(setShowHomeSettings(!showHomeSettings));
  };

  useEffect(() => {
    if (settingsHeight) {
      Animated.timing(height, {
        toValue: showHomeSettings ? settingsHeight : 0,
        duration: 250,
        useNativeDriver: false
      }).start();
      setTimeout(() => {
        Animated.timing(backdropOpacity, {
          toValue: showHomeSettings ? 1 : 0,
          duration: showHomeSettings ? 150 : 0,
          useNativeDriver: true
        }).start();
      }, showHomeSettings ? 250 : 0);
      showHomeSettings ? setTimeout(() => setDisplayShadow(true), 250) : setDisplayShadow(false);
    }
  }, [settingsHeight, showHomeSettings]);


  return (
    <>
      <Animated.View
        onLayout={(event) => {
          if (!settingsHeight && event?.nativeEvent?.layout?.height) {
            initialLoad(event?.nativeEvent?.layout);
          }
        }}
        style={[styles.settings, {
          height: settingsHeight ? height : undefined,
          visibility: settingsHeight ? "visible" : "hidden",
          opacity: settingsHeight ? 1 : 0
        }, displayShadow && Platform.OS === "ios" && styles.shadow]}>
        <View style={styles.wrapper}>
          <View style={styles.search}>
            <View style={styles.searchTop}>
              <Text style={styles.searchTopLeft}>{LangService.strings.FILTER_TITLE}</Text>
            </View>
            <View style={[styles.searchBottom]}>
              <TextInput
                value={searchText}
                onChangeText={(e) => {
                  onTextChange(e);
                  setSearchText(e);
                }}
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
            <Text style={styles.distanceText}>{LangService.strings.DISTANCE + " " + LangService.strings.FROM_YOU}</Text>
            <DraggableSilder
              values={distance}
              min={minKm}
              max={maxKm}
              step={step}
              initialValue={distance}
              onValueChange={onDistanceChange}
              enableLabel={true}
              selectedSliderColor={"#A71580"}
              unSelectedSliderColor={"#E7E7E7"}
              sliderHeight={4}
              snapped={true}
            />
            <View style={styles.distanceValues}>
              <Text style={styles.distanceValue}>0 km</Text>
              <Text style={styles.distanceValue}> {LangService.strings.MORE_THAN + " " + maxKm} km</Text>
            </View>
          </View>
          {showFilterButton && <Portal>
            <Animated.View style={{ top: settingsHeight ? height : undefined }}>
              <TouchableOpacity
                onPress={toggleOpen}
                style={[styles.toggleSettings, {
                  top: ((segmentLayout || 0) + (insets?.top || 0)) - 18
                }]}>
                <View
                  style={{ transform: [{ rotateX: showHomeSettings ? "180deg" : "0deg" }] }}
                >
                  <ArrowDown />
                </View>
                <Text style={styles.toggleSettingsText}>{LangService.strings.SEARCH}</Text>
              </TouchableOpacity>
            </Animated.View>
          </Portal>
          }
        </View>
      </Animated.View>
    </>
  );
};


export default memo(HomeSettings);
