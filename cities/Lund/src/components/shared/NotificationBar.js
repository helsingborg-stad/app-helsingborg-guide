import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated
} from "react-native";
import ErrorText from "./ErrorText";
import LangService from "@services/langService";

import Icon from "react-native-vector-icons/MaterialIcons";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as errorActions from "@actions/errorActions";
import { Colors } from "@assets/styles";

const FULL_WIDTH = Dimensions.get("window").width;

type Props = {
  visible: any,
  errorActions: any,
  style: any
};

type State = {
  visible: any,
  animValue: Animated.Value
};

class NotificationBar extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { visible } = nextProps;
    const { animValue, visible: previouslyVisible } = prevState;

    if (visible !== previouslyVisible) {
      const animationProperties = visible
        ? { toValue: 1, friction: 2 }
        : { toValue: 0 };
      Animated.timing(animValue, animationProperties).start();
      return { visible };
    }

    return null;
  }

  constructor(props: Props) {
    super(props);
    this.state = { animValue: new Animated.Value(0), visible: props.visible };
  }

  clearErrorMsg() {
    this.props.errorActions.clearError();
  }

  render() {
    const {
      state: { animValue }
    } = this;
    const indexAnim = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 1000]
    });

    return (
      <Animated.View
        style={[styles.bar, this.props.style || null, { zIndex: indexAnim }]}
      >
        <View style={styles.mainContainer}>
          <ErrorText text={LangService.strings.OBS} />
        </View>
        <TouchableOpacity
          style={styles.closeBtnContainer}
          onPress={this.clearErrorMsg.bind(this)}
        >
          <Icon name="close" size={25} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 60,
    width: FULL_WIDTH,
    position: "absolute",
    left: 0,
    zIndex: 1000,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.themeContol
  },
  mainContainer: {
    flex: 4
  },
  closeBtnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

function mapStateToProps(state) {
  return {
    visible: !!state.error.msg
  };
}
function mapDispatchToProps(dispatch) {
  return {
    errorActions: bindActionCreators(errorActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationBar);
