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
  navigation: Object,
}

type State = {
  showInfoOverlay: boolean,
}


function createItemsFromCurrentTrail(currentTrail: Guide) {
  const { contentObjects } = currentTrail;
  // const embeddedLocations = trail._embedded.location;
  const trailObjects = [];

  contentObjects.forEach((item) => {
    const objectId = item.id;

    trailObjects.push({
      id: objectId,
      location: item.location ? { longitude: parseFloat(item.location.longitude), latitude: parseFloat(item.location.latitude) } : null,
      title: item.title,
      imageUrl: item.images[0].medium,
      thumbnailUrl: item.images[0].thumbnail,
      streetAdress: item.location ? item.location.streetAddress : null,
      order: item.order,
      labelDisplayNumber: 0,
      item,
      imageType: "TrailScreen", // TODO: WTF is this?
    });
  });

  trailObjects.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));

  // ALB: labelDisplayNumber is set to index value, as it's the easiest way to pass the information. This replaces using trailObject.order as label, as we can't trust the backend.
  // BP: Can we now?
  let index = 1;
  trailObjects.forEach((item) => {
    item.labelDisplayNumber = index;
    index += 1;
  });

  return trailObjects;
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
    this.setState({ showInfoOverlay: !this.state.showInfoOverlay });
  }

  render() {
    const { navigation } = this.props;
    const trailItems = createItemsFromCurrentTrail(this.props.currentGuide);

    if (trailItems.length <= 0) { return null; }

    return (
      <View style={styles.container}>
        <MapWithListView
          items={trailItems}
          initialLocation={trailItems[0].location}
          navigation={navigation}
          stopAudioOnUnmount
          id={this.props.currentGuide.id}
        />
        <TrailView
          trail={this.props.currentGuide}
          showInfoOverlay={this.state.showInfoOverlay}
          onToggleInfoOverlay={this.toggleInfoOverlay}
        />

      </View>

    );
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}

export default connect(mapStateToProps)(TrailScreen);
