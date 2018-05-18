// @flow

import React, {
  Component,
} from "react";

import {
  connect,
} from "react-redux";

import InfoOverlayToggleView from "../shared/InfoOverlayToggleView";
import TrailView from "../shared/TrailView";

type Props = {
  currentGuide: Guide,
  navigation: Object,
}

type State = {
  showInfoOverlay: boolean,
}

/** Temporary until landing page is fixed and we don't use MapWithListView with old data anymore */
function createItemsFromCurrentTrail(currentTrail: Guide) {
  const { contentObjects } = currentTrail;

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
  // BP: Can we change this now?
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
    const trailItems: Object[] = createItemsFromCurrentTrail(this.props.currentGuide);
    if (trailItems.length <= 0) { return null; }

    return (
      <TrailView
        trail={this.props.currentGuide}
        trailItems={trailItems}
        showInfoOverlay={this.state.showInfoOverlay}
        onToggleInfoOverlay={this.toggleInfoOverlay}
        navigation={this.props.navigation}
      />
    );
  }
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}

export default connect(mapStateToProps)(TrailScreen);
