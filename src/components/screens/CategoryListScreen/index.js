// @flow
import React, { Component } from "react";
import {
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import LangService from "../../../services/langService";
import styles from "./styles";
import {
  selectCurrentGuideByID,
  selectCurrentGuideGroup,
  selectCurrentCategory,
} from "../../../actions/uiStateActions";

type Props = {
  navigation: any,
  currentCategory: ?RenderableNavigationCategory,
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
}

class HomeScreen extends Component<Props> {
  onPressItem = (item: RenderableNavigationItem): void => {
    switch (item.type) {
      case "guide":
        this.props.selectGuide(item.id);
        this.props.navigation.navigate("GuideDetailsScreen");
        break;
      case "trail":
        this.props.selectGuide(item.id);
        this.props.navigation.navigate("TrailScreen");
        break;
      case "guidegroup":
        this.props.selectGuideGroup(item.id);
        this.props.navigation.navigate("LocationScreen");
        break;
      default:
    }
  }

  renderGuideCount = (item: RenderableNavigationItem) => {
    const { guidesCount, type } = item;
    if (!guidesCount) return null;

    const plural = guidesCount > 1;

    let textString = null;
    if (type === "guidegroup") {
      const mediaGuideString: string = plural ? LangService.strings.MEDIAGUIDES : LangService.strings.MEDIAGUIDE;
      textString = `${guidesCount} ${mediaGuideString.toUpperCase()}`;
    } else if (type === "trail") {
      const locationString: string = plural ? LangService.strings.LOCATIONS : LangService.strings.LOCATION;
      textString = `${LangService.strings.TOUR} ${LangService.strings.WITH} ${guidesCount} ${locationString}`;
      textString = textString.toUpperCase();
    } else if (type === "guide") {
      textString = `${LangService.strings.MEDIAGUIDE} ${LangService.strings.WITH} ${guidesCount} ${LangService.strings.OBJECT}`;
    }

    if (!textString) return null;

    return (<Text style={styles.listItemGuideCount}>{textString}</Text>);
  }

  // TODO extract component
  renderNavigationItem = (item: RenderableNavigationItem) => (
    <TouchableOpacity
      onPress={() => this.onPressItem(item)}
      style={styles.listItemContainer}
    >
      <View style={styles.imageWrapper}>
        <Image
          style={styles.listItemImage}
          source={{ uri: item.image }}
        />
      </View>
      <View style={styles.listItemTextContainer}>
        <Text style={styles.listItemTitle}>{item.title}</Text>
        {this.renderGuideCount(item)}
      </View>
    </TouchableOpacity>
  )

  render() {
    const { currentCategory } = this.props;
    if (!currentCategory) return null;

    return (
      <FlatList
        style={styles.container}
        renderItem={({ item }) => this.renderNavigationItem(item)}
        keyExtractor={item => String(item.id)}
        data={currentCategory.items}
      />);
  }
}


function mapStateToProps(state: RootState) {
  const { uiState } = state;
  const { currentCategory } = uiState;

  return {
    currentCategory,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectGuide: (id: number) => dispatch(selectCurrentGuideByID(id)),
    selectGuideGroup: (id: number) => dispatch(selectCurrentGuideGroup(id)),
    selectCurrentCategory: (category: RenderableNavigationCategory) => dispatch(selectCurrentCategory(category)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
