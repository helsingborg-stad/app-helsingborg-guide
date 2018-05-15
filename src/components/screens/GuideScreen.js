// @flow

import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import GuideView from "../shared/GuideView";
import { selectCurrentContentObject } from "../../actions/uiStateActions";
import SearchButton from "../header/SearchButton";

declare type Props = {
  currentGuide: ?Guide,
  selectCurrentContentObject(contentObject: ContentObject): void,
  navigation: any
}

class GuideScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    if (params) {
      const { title } = params;
      return {
        title,
        headerRight: (<SearchButton navigation={navigation} />),
      };
    }
    return {};
  };

  constructor(props: Props) {
    super(props);

    const { currentGuide } = props;
    const title = currentGuide ? currentGuide.name : null;
    props.navigation.setParams({ title });
  }

  onPressContentObject = (obj: ContentObject) => {
    this.props.selectCurrentContentObject(obj);
    this.props.navigation.navigate("ObjectDetailsScreen");
  }

  render() {
    const { currentGuide } = this.props;
    return currentGuide ?
      (
        <GuideView
          guide={currentGuide}
          onPressContentObject={this.onPressContentObject}
        />
      ) : <View />;
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}


function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentContentObject:
      contentObject => dispatch(selectCurrentContentObject(contentObject)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideScreen);
