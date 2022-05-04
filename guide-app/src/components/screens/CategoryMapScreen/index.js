// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import {
  showBottomBar
} from "@actions/uiStateActions";

import { HeaderStyles } from "@assets/styles";
import Map from "@shared-components/Map";

type Props = {
  navigation: any,
  currentCategory: ?NavigationCategory,
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
  dispatchShowBottomBar(visible: boolean): void
};

class CategoryMapScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    let title = null;
    const { params } = navigation.state;
    if (params) {
      ({ title } = params);
    }
    return {
      ...HeaderStyles.noElevation,
      title,
      headerRight: () => <View />,
      headerLeft: () => <HeaderBackButton navigation={navigation} />
    };
  };

  constructor(props: Props) {
    super(props);
    const { currentCategory } = props;
    if (currentCategory) {
      const { name: title } = currentCategory;
      props.navigation.setParams({ title });
    }
  }

  componentDidMount() {
    this.props.dispatchShowBottomBar(false);
  }

  componentWillUnmount() {
    this.props.dispatchShowBottomBar(true);
  }

  render() {
    const { navigation } = this.props;
    return (
      <Map
        navigation={navigation}
      />
    );
  }
}

function mapStateToProps(state: RootState) {
  const { uiState, navigation } = state;
  const { currentHomeTab: categoryIndex } = uiState;
  const category = navigation.navigationCategories[categoryIndex];

  return {
    currentCategory: category
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryMapScreen);
