import React, {
  Component,
} from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import PropTypes from "prop-types";
import {
  connect,
} from "react-redux";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
} from "../../utils/";
import LangService from "../../services/langService";
import MapWithListView from "../shared/MapWithListView";
import MapInformationOverlay from "../shared/MapInformationOverlay";

const infoBarButtonIcon = require("../../images/ic_info.png");

const styles = StyleSheet.create({
  barButtonItem: {
    flexDirection: "row",
    right: 5,
    width: 120,
    height: 44,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  barButtonItemImage: {
    margin: 5,
  },
  barButtonItemText: StyleSheetUtils.flatten([
    TextStyles.description, {
      color: Colors.white,
    },
  ]),
  overlayStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
});

class TrailScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    trailInformation: PropTypes.object.isRequired,
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
          <Text style={styles.barButtonItemText}>{LangService.strings.ABOUT}</Text>
          <Image style={styles.barButtonItemImage} source={infoBarButtonIcon} />
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
  }

  renderMapInformationOverlay = () => {
    const { trailInformation } = this.props;
    const { showInfoOverlay } = this.state;

    if (!showInfoOverlay) {
      return null;
    }

    return ([
      <TouchableWithoutFeedback
        style={styles.overlayStyle}
        key="TouchableWithoutFeedback"
        onPress={() => this.toggleInfoOverlay()}
      >
        <View
          style={styles.overlayStyle}
          key="overlayView"
        />
      </TouchableWithoutFeedback>,
      <MapInformationOverlay
        key="MapInformationOverlay"
        trailInformation={trailInformation}
        onPressFunction={() => this.toggleInfoOverlay()}
      />,
    ]);
  }

  render() {
    const { navigation, trailObjects } = this.props;
    const trailItem = trailObjects[0];

    return (
      [<MapWithListView
        key="MapWithListView"
        items={trailObjects}
        initialLocation={trailItem.location}
        navigation={navigation}
      />,
      this.renderMapInformationOverlay(),
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
