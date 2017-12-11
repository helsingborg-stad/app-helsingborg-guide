import React, {
  Component,
} from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";
import {
  connect,
} from "react-redux";
import MapWithListView from "../shared/MapWithListView";
import MapInformationOverlay from "../shared/MapInformationOverlay";

const settingsIcon = require("../../images/settings.png");

const styles = StyleSheet.create({
  barButtonItem: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});

class TrailScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
  }

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    const { params = {} } = navigation.state;
    const { toggleInfoOverlay } = params;
    return {
      title,
      headerRight: (
        <TouchableOpacity
          onPress={toggleInfoOverlay}
          style={styles.barButtonItem}
        >
          <Image source={settingsIcon} />
        </TouchableOpacity>
      ),
    };
  };

  static trailInformation(trail, guides) {
    const { id } = trail.guidegroup[0];
    const guideInfo = guides.find(guideItem => guideItem.id === id);
    return { title: guideInfo.name, description: guideInfo.description };
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
    this.setState({ showInfoOverlay: !this.state.showInfoOverlay });
    console.log(this.state.showInfoOverlay);
  }

  render() {
    const { navigation, trailObjects, trailInformation } = this.props;
    const { showInfoOverlay } = this.state;
    const trailItem = trailObjects[0];
    return (
      [<MapWithListView
        key="MapWithListView"
        items={trailObjects}
        initialLocation={trailItem.location}
        navigation={navigation}
      />,
      showInfoOverlay &&
      <MapInformationOverlay
        key="MapInformationOverlay"
        trailInformation={trailInformation}
        onPressFunction={() => this.toggleInfoOverlay()}
        />,
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
