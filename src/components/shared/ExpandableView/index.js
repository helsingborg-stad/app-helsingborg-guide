// @flow
import React, { type Node, Component } from "react";
import {
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styles from "./styles";

type Props = {
  style?: any,
  children?: Node,
  maxHeight: number,
};

type State = {
  expanded: boolean
}

class ExpandableText extends Component<Props, State> {
  static defaultProps = {
    style: null,
    children: null,
  };

  state = {
    expanded: false,
  };

  onPress = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { expanded } = this.state;
    const extraStyles = !expanded ? [styles.collapsed, { maxHeight: this.props.maxHeight }] : [];
    return (
      <TouchableWithoutFeedback
        onPress={this.onPress}
      >
        <View
          style={[this.props.style, ...extraStyles]}
        >
          {this.props.children}
        </View>
      </TouchableWithoutFeedback >
    );
  }
}

export default ExpandableText;
