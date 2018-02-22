import React, { PureComponent } from "react";
import { View } from "react-native";

class ViewPagerAndroidContainer extends PureComponent {
  state = {
    width: 0,
    height: 0,
  }

  _onLayoutChange = (e) => {
    const { width, height } = e.nativeEvent.layout;
    this.setState({ width, height });
  }

  render() {
    return (
      <View style={[this.props.style]} onLayout={this._onLayoutChange}>
        <View style={{ width: this.state.width, height: this.state.height }}>{this.props.children}</View>
      </View>
    );
  }
}

export default ViewPagerAndroidContainer;
