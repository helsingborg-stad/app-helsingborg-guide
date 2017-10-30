/**
 * Created by msaeed on 2017-02-04.
 */
import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Thumbnail from "./thumbnail";

export default class ThumbnailsGrid extends Component {
  render() {
    return (
      <ScrollView style={styles.grid}>
        <View style={styles.row}>
          <Thumbnail style={styles.thumbnail} />
          <Thumbnail style={styles.thumbnail} />
        </View>
        <View style={styles.row}>
          <Thumbnail style={styles.thumbnail} />
          <Thumbnail style={styles.thumbnail} />
        </View>
        <View style={styles.row}>
          <Thumbnail style={styles.thumbnail} />
          <Thumbnail style={styles.thumbnail} />
        </View>
        <View style={styles.row}>
          <Thumbnail style={styles.thumbnail} />
          <Thumbnail style={styles.thumbnail} />
        </View>
        <View style={styles.row}>
          <Thumbnail style={styles.thumbnail} />
          <Thumbnail style={styles.thumbnail} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  grid: { flex: 1, paddingHorizontal: 20, paddingVertical: 20 },
  row: {
    // backgroundColor:'#fffb2c',
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 25,
  },
  thumbnail: { flex: 1 },
});
