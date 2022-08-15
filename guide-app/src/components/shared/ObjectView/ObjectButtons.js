import React, { memo, useState } from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Colors } from "@assets/styles";
import styles from "./style";
import { trackScreen } from "@utils/MatomoUtils";

type Props = {
  swipeable?: Boolean,
  scrollable?: Boolean,
  panToIndex?: number,
  selectObject: any,
  navigation: Object,
  array?: Array,
  order?: number,
  path?: string,
};
const ObjectButtons = (props: Props) => {
  const {
    array,
    navigation,
    selectObject,
    order,
    scrollable,
    panToIndex,
    path,
  } = props;
  const [width, setWidth] = useState("");
  const split = path.split("/");

  const onLayout = (event) => {
    setWidth(event.nativeEvent.layout.width);
  };
  return array?.length ? (
    <View style={styles.navGuideWrapper}>
      <Text style={styles.navGuideBarStep}>{`${order + 1} av ${
        array.length
      }`}</Text>
      <View style={styles.navGuide}>
        <Icon
          name={"chevron-left"}
          size={36}
          color={Colors.themeExtra1}
          style={{ opacity: order > 0 ? 1 : 0.4 }}
          onPress={
            order > 0
              ? () => {
                  let newPath =
                    split.slice(0, split.length - 1).join("/") +
                    `/${array[order - 1].title}`;
                  trackScreen(newPath, newPath);
                  scrollable && scrollable(order - 1);
                  selectObject && selectObject(array[order - 1]);
                  panToIndex && panToIndex(order - 1);
                  navigation.navigate({
                    name: "ObjectScreen",
                    params: {
                      title: array[order - 1].title,
                      currentGuide: array[order - 1],
                      order: order - 1,
                      array: array,
                      swipeable: true,
                      path: newPath,
                    },
                    merge: true,
                  });
                }
              : null
          }
        />
        <View style={styles.navGuideBarWrapper}>
          <View onLayout={onLayout} style={styles.navGuideBar}>
            {width ? (
              <View
                style={[
                  styles.navGuideBarFilled,
                  {
                    transform: [
                      {
                        translateX:
                          -width +
                          Math.round(width * ((order + 1) / array.length)),
                      },
                    ],
                  },
                ]}
              />
            ) : null}
          </View>
        </View>
        <Icon
          name={"chevron-right"}
          size={36}
          color={Colors.themeExtra1}
          style={{ opacity: order + 1 !== array.length ? 1 : 0.5 }}
          onPress={
            order + 1 !== array.length
              ? () => {
                  let newPath =
                    split.slice(0, split.length - 1).join("/") +
                    `/${array[order + 1].title}`;
                  trackScreen(newPath, newPath);
                  scrollable && scrollable(order + 1);
                  selectObject && selectObject(array[order + 1]);
                  panToIndex && panToIndex(order + 1);
                  navigation.navigate({
                    name: "ObjectScreen",
                    params: {
                      title: array[order + 1].title,
                      currentGuide: array[order + 1],
                      order: order + 1,
                      array: array,
                      swipeable: true,
                      path: newPath,
                    },
                    merge: true,
                  });
                }
              : null
          }
        />
      </View>
    </View>
  ) : null;
};

export default memo(ObjectButtons);
