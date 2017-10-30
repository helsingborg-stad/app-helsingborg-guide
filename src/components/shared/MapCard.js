import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import pathHelper from "../../lib/polylineHelpers";
import ViewContainer from "../shared/view_container";

const markerImage = require("../../images/marker.png");

export default class MapCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 56.04765769999999,
        longitude: 12.6888389,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [],
    };
  }

  componentDidMount() {
    this.setState({ markers: this.props.markers });
  }

  _showMarkers() {
    if (this.props.markers.length) { return this.props.markers.map((marker, index) => <MapView.Marker key={index} coordinate={marker} image={markerImage} />); }
  }

  _showPolyLine(step, index) {
    const helper = pathHelper();
    return (
      <MapView.Polyline
        key={index}
        coordinates={helper.decodePath(step.polyline.points)}
        strokeColor="salmon"
        strokeWidth={5}
        onPress={data => console.log("path is pressed", data)}
      />
    );
  }

  // _showDirectionsPath(){
  //     const steps =  _DIRECTIONS.routes[0].legs[0].steps;
  //     return steps.map((step,index)=>this._showPolyLine(step,index));
  // }

  render() {
    return (
      <View style={styles.mapViewContainer}>
        <MapView style={styles.map} region={this.state.region} cacheEnabled>
          {/* {this._showMarkers() } */}
          {/* {this._showDirectionsPath()} */}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapViewContainer: { flex: 1, justifyContent: "flex-start", alignItems: "stretch" },
  map: { flex: 1, height: 150 },
});
