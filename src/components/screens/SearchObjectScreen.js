// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import KeyPad from "../shared/KeyPad";
import { selectCurrentContentObject } from "../../actions/uiStateActions";
import { AnalyticsUtils } from "../../utils/";

type Props = {
  navigation: any,
  contentObjects: ContentObject[],
  currentGuide: Guide,
  selectCurrentContentObject(contentObject: ContentObject): void
};

class SearchObjectScreen extends Component<Props> {
  keyPad: ?KeyPad;

  onPressClose = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };

  onSearch = (id: string) => {
    const found = this.props.contentObjects.find(
      item => item.searchableId === id
    );
    if (found) {
      this.props.selectCurrentContentObject(found);
      const { navigate } = this.props.navigation;
      AnalyticsUtils.logEvent("view_object", { name: found.title });
      navigate("ObjectScreen", {
        title: found.title,
        currentGuide: this.props.currentGuide
      });
    } else {
      const { keyPad } = this;
      if (keyPad) {
        keyPad.shake();
        keyPad.clearAll();
      }
    }
  };

  render() {
    return (
      <KeyPad
        ref={keyPad => {
          this.keyPad = keyPad;
        }}
        onPressClose={this.onPressClose}
        onSearch={this.onSearch}
      />
    );
  }
}

function mapStateToProps(state: RootState) {
  const { uiState } = state;
  const { currentGuide } = uiState;
  let contentObjects: ContentObject[] = [];
  if (currentGuide) {
    ({ contentObjects } = currentGuide);
  }
  return {
    contentObjects,
    currentGuide
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentContentObject: contentObject =>
      dispatch(selectCurrentContentObject(contentObject))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchObjectScreen);
