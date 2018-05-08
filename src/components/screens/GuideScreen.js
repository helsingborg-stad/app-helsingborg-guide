// @flow

import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import GuideView from "../shared/GuideView";
import { selectCurrentContentObject } from "../../actions/uiStateActions";

declare type Props = {
  currentGuide: ?Guide,
  dispatchSelectContentObject(guide: Guide, id: string): void,
  navigation: any
}

class GuideScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    if (params) {
      const { title } = params;
      if (title) {
        return { title };
      }
    }
    return {};
  };

  constructor(props: Props) {
    super(props);

    const { currentGuide } = props;
    const title = currentGuide ? currentGuide.name : null;
    props.navigation.setParams({ title });
  }

  onPressContentObject = (guide: Guide, obj: ContentObject) => {
    this.props.dispatchSelectContentObject(guide, obj.id);
    // AnalyticsUtils.logEvent("view_object", { name: contentObject.title });
    this.props.navigation.navigate("ObjectScreen", { title: obj.title, currentGuide: this.props.currentGuide });
  }

  render() {
    const { currentGuide } = this.props;
    return currentGuide ? (<GuideView
      guide={currentGuide}
      onPressContentObject={this.onPressContentObject}
    />) : <View />;
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}


function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchSelectContentObject: (guide, id) => dispatch(selectCurrentContentObject(guide, id)),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideScreen);
