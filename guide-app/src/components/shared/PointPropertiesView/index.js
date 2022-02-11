// @flow

import React from "react";
import { View, Text, Image } from "react-native";
import SVGView from "@shared-components/SVGView";
import styles from "./style";

const pointPropertyPlaceholderImage = require("@assets/images/iconPointPropertyPlaceholder.png");

function getPointProperties(pointProperties: PointProperty[]) {

  const pointPropertyView = (
    <View>
      <View style={styles.divider} />
      <View style={styles.pointPropertiesSectionContainer}>
        {pointProperties.map(element => (
          <View style={styles.pointPropertyContainer} key={element.id}>
            <SVGView
              logoType={element.icon}
              placeholderImage={pointPropertyPlaceholderImage}
              customStyle={styles.pointPropertyIcon}
            />
            <Text style={styles.pointPropertyText}>{element.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
  return pointPropertyView;
}

type Props = {
  pointProperties: PointProperty[]
};

export default function PointPropertiesView(props: Props) {
  return getPointProperties(props.pointProperties);
}
