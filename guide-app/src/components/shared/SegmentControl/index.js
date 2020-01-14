// @flow
import React, { Component } from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import styles from "./styles";

type Props = {
  labels: Array<string>,
  initalSelectedIndex?: number,
  onSegmentIndexChange?: ?(index: number) => void,
  style: any
};
type State = {
  selectedIndex: number
};

export default class SegmentControl extends Component<Props, State> {
  static defaultProps = {
    initalSelectedIndex: 0,
    onSegmentIndexChange: null
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIndex: props.initalSelectedIndex || 0
    };
  }

  containerWidth = 0;

  selectedViewLeftInset = new Animated.Value(0);

  onPressSegmentIndex = (index: number) => {
    const { onSegmentIndexChange, labels } = this.props;

    Animated.spring(this.selectedViewLeftInset, {
      toValue: (index / labels.length) * this.containerWidth
    }).start();

    this.setState({ selectedIndex: index });

    if (onSegmentIndexChange) {
      onSegmentIndexChange(index);
    }
  };

  renderSegmentItem = (label: string, index: number) => {
    const { selectedIndex } = this.state;

    return (
      <TouchableOpacity
        style={styles.segmentItem}
        key={label}
        onPress={() => this.onPressSegmentIndex(index)}
      >
        <Text
          style={
            index === selectedIndex
              ? styles.segmentLabelSelected
              : styles.segmentLabel
          }
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { labels, style, initalSelectedIndex } = this.props;
    const width = (1 / labels.length) * 100;
    const selectionViewStyle = {
      width: `${width}%`,
      left: this.selectedViewLeftInset
    };

    return (
      <View
        style={[styles.container, style]}
        onLayout={e => {
          if (this.containerWidth === 0) {
            this.containerWidth = e.nativeEvent.layout.width;
            this.selectedViewLeftInset = new Animated.Value(
              ((initalSelectedIndex || 0) / labels.length) * this.containerWidth
            );
          }
        }}
      >
        {labels.map(this.renderSegmentItem)}
        <Animated.View style={[styles.selectionView, selectionViewStyle]} />
      </View>
    );
  }
}
