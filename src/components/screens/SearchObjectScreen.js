// @flow

import React, { Component } from "react";
import KeyPad from "../shared/KeyPad";

type Props = {
  navigation: any,
}

class SearchObjectScreen extends Component<Props> {
  onPressClose = () => {
    const { goBack } = this.props.navigation;
    goBack();
  }

  onSearch = (id: string) => {
    console.log(`onSearch: ${id}`);
    // TODO if succesful: navigate and close modal
    // TODO if unsuccesful: shake and clear text
  }

  render() {
    return (<KeyPad onPressClose={this.onPressClose} onSearch={this.onSearch} />);
  }
}

// TODO connect to redux store, in order to be able to search the current content objects


export default SearchObjectScreen;
