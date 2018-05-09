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
  expanded: boolean,
  overflow: boolean,
}

class ExpandableView extends Component<Props, State> {
  static defaultProps = {
    style: null,
    children: null,
  };

  state = {
    expanded: false,
    overflow: false,
  };

  onPress = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { expanded, overflow } = this.state;
    const { maxHeight } = this.props;
    const extraStyles = (overflow && !expanded) ? [styles.collapsed, { maxHeight }] : [];
    return (
      <TouchableWithoutFeedback
        onPress={this.onPress}
        onLayout={({ nativeEvent }) => {
          const { height } = nativeEvent.layout;
          if (height > maxHeight) {
            this.setState({ overflow: true });
          }
        }}
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

export default ExpandableView;
