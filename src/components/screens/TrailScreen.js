import React, {
  Component,
} from "react";
import PropTypes from "prop-types";
import {
  connect,
} from "react-redux";
import MapWithListView from "../shared/MapWithListView";

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

  render() {
    const { navigation, trailObjects } = this.props;
    const trailItem = trailObjects[0];
    return (
      <MapWithListView
        items={trailObjects}
        initialLocation={trailItem.location}
        navigation={navigation}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { trail } = ownProps.navigation.state.params;

  const trailObjects = MapWithListView.createItemsFromTrail(trail);

  return {
    trailObjects,
  };
}

export default connect(mapStateToProps)(TrailScreen);
