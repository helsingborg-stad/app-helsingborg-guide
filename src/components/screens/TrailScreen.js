// @flow

import React, {
  Component,
} from "react";

import { View } from "react-native";
import {
  connect,
} from "react-redux";

import MapWithListView from "../shared/MapWithListView";
import InfoOverlayToggleView from "../shared/InfoOverlayToggleView";
import TrailView from "../shared/TrailView";

import styles from "../shared/TrailView/style";


type Props = {
  currentGuide: Guide,
  trailObjects: Object[],
  trailInformation: Object,
  navigation: Object,
}

type State = {
  showInfoOverlay: boolean,
}

class TrailScreen extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    const { params = {} } = navigation.state;
    const { toggleInfoOverlay } = params;
    return {
      title,
      headerRight: (
        <InfoOverlayToggleView onToggleInfoOverlay={toggleInfoOverlay} />
      ),
    };
  };

  static trailInformation(trail: ?Guide) {
    if (trail) { return { title: trail.name, description: trail.description }; }
    return {};
  }

  constructor(props) {
    super(props);

    this.state = {
      showInfoOverlay: true,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ toggleInfoOverlay: this.toggleInfoOverlay });
  }


  toggleInfoOverlay = () => {
    console.log("TOGGLE IT BABY!");
    this.setState({ showInfoOverlay: !this.state.showInfoOverlay });
  }

  render() {
    const { navigation, trailObjects } = this.props;
    const trailItem = trailObjects[0];

    if (!trailItem) { return null; }

    return (
      <View style={styles.container}>
        <MapWithListView

          items={trailObjects}
          initialLocation={trailItem.location}
          navigation={navigation}
          stopAudioOnUnmount
          id={this.props.currentGuide.id}
        />
        <TrailView
          trailInformation={this.props.trailInformation}
          showInfoOverlay={this.state.showInfoOverlay}
          onToggleInfoOverlay={this.toggleInfoOverlay}
        />

      </View>

    );
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  const trailObjects = currentGuide ? MapWithListView.createItemsFromTrail(currentGuide, "TrailScreen") : [];
  const trailInformation = TrailScreen.trailInformation(currentGuide);

  return { currentGuide, trailObjects, trailInformation };
}

export default connect(mapStateToProps)(TrailScreen);
