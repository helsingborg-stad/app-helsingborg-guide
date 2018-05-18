// @flow

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

const infoBarButtonIcon = require("../../images/iconInfo.png");

const styles = StyleSheet.create({
  barButtonItem: {
    opacity: 0.7,
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
    backgroundColor: Colors.transparent,
  },
});

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
        <TouchableOpacity
          onPress={toggleInfoOverlay}
          style={styles.barButtonItem}
        >
          <Text style={styles.barButtonItemText}>{LangService.strings.INFO}</Text>
          <Image style={styles.barButtonItemImage} source={infoBarButtonIcon} />
        </TouchableOpacity>
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
      /* downloadComponent={() => this.displayDownloadIndicator()} */
      />,
    ]);
  }

  render() {
    const { navigation, trailObjects } = this.props;
    const trailItem = trailObjects[0];

    if (!trailItem) { return null; }

    return (
      [<MapWithListView
        key="MapWithListView"
        items={trailObjects}
        initialLocation={trailItem.location}
        navigation={navigation}
        stopAudioOnUnmount
        id={this.props.currentGuide.id}
      />,
      this.renderMapInformationOverlay(),
      ]
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
