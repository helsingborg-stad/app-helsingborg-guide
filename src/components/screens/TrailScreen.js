import React, {
  Component,
} from "react";
import {
  View,
} from "react-native";
import PropTypes from "prop-types";
import {
  connect,
} from "react-redux";
import MapWithListView from "../shared/MapWithListView";
import MapInformationOverlay from "../shared/MapInformationOverlay";

class TrailScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
  }

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return {
      title,
    };
  };

  static trailInformation(trail, guides) {
    const { id } = trail.guidegroup[0];
    const guideInfo = guides.find(guideItem => guideItem.id === id);
    return { title: guideInfo.name, description: guideInfo.description };
  }

  render() {
    const { navigation, trailObjects, trailInformation } = this.props;
    const trailItem = trailObjects[0];
    return (
      [<MapWithListView
        key="MapWithListView"
        items={trailObjects}
        initialLocation={trailItem.location}
        navigation={navigation}
      />,
        <MapInformationOverlay key="MapInformationOverlay" trailInformation={trailInformation} />,
      ]
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { trail } = ownProps.navigation.state.params;
  const { guides } = state;

  const trailObjects = MapWithListView.createItemsFromTrail(trail);
  const trailInformation = TrailScreen.trailInformation(trail, guides);

  return {
    trailObjects,
    trailInformation,
  };
}

export default connect(mapStateToProps)(TrailScreen);
