// @flow
import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "./styles";

type Props = {
  labels: Array<string>,
  initalSelectedIndex?: number,
  onSegmentIndexChange?: ?(index: number) => void,
};
type State = {
  selectedIndex: number,
};

export default class SegmentControl extends Component<Props, State> {
  static defaultProps = {
    initalSelectedIndex: 0,
    onSegmentIndexChange: null,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIndex: props.initalSelectedIndex || 0,
    };
  }

  onPressSegmentIndex = (index: number) => {
    this.setState({ selectedIndex: index });

    const { onSegmentIndexChange } = this.props;
    if (onSegmentIndexChange) {
      onSegmentIndexChange(index);
    }
  };

  renderSegmentItem = (label: string, index: number) => {
    const { selectedIndex } = this.state;

    return (
      <TouchableOpacity style={styles.segmentItem} key={label} onPress={() => this.onPressSegmentIndex(index)}>
        <Text style={index === selectedIndex ? styles.segmentLabelSelected : styles.segmentLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { labels } = this.props;
    return <View style={styles.container}>{labels.map(this.renderSegmentItem)}</View>;
  }
}
