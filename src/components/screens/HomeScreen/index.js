// @flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  Image,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import LangService from "../../../services/langService";
import { HeaderStyles } from "../../../styles";
import styles from "./styles";
import {
  selectCurrentGuideByID,
  selectCurrentGuideGroup,
  selectCurrentCategory,
} from "../../../actions/uiStateActions";

const settingsIcon = require("../../../images/settings.png");

type Props = {
  navigation: any,
  showLoadingSpinner: boolean,
  navigationSections: RenderableNavigationCategory[],
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
  selectCurrentCategory(section: RenderableNavigationCategory): void
}

class HomeScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const title = LangService.strings.APP_NAME;
    return Object.assign(HeaderStyles.noElevation, {
      title,
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsScreen")}
          style={styles.barButtonItem}
        >
          <Image style={styles.barButtonImage} source={settingsIcon} />
        </TouchableOpacity>
      ),
    });
  }

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

  onPressViewAll = (data: RenderableNavigationItem[]) => {
    this.props.selectCurrentCategory(data);
    this.props.navigation.navigate("CategoryListScreen");
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

  renderSectionHeader = (section: { title: string }) =>
    (
      <View style={styles.sectionContainer} >
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    )

  renderSectionFooter = (section: { title: string, data: RenderableNavigationItem[] }) => (
    <View style={styles.sectionFooterContainer}>
      <TouchableOpacity style={styles.sectionFooterButton} onPress={() => this.onPressViewAll(section.data)}>
        <Text style={styles.sectionFooterText}>{LangService.strings.VIEW_ALL.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    if (this.props.showLoadingSpinner) {
      return (<ActivityIndicator style={styles.loadingSpinner} />);
    }

    const { navigationSections } = this.props;
    const sections = navigationSections.map(cat => ({ title: cat.name, data: cat.items, category: cat }));
    return (
      <SectionList
        style={styles.container}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
        renderItem={({ item }) => this.renderNavigationItem(item)}
        renderSectionFooter={({ section }) =>
          // $FlowFixMe flow doesn't understand me
          this.renderSectionFooter(section)
        }
        keyExtractor={item => item.id}
        sections={sections}
      />);
  }
}


function mapStateToProps(state: RootState) {
  const { navigation } = state;
  const { isFetching, renderableNavigationCategories } = navigation;

  return {
    showLoadingSpinner: isFetching,
    navigationSections: renderableNavigationCategories,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectGuide: (id: number) => dispatch(selectCurrentGuideByID(id)),
    selectGuideGroup: (id: number) => dispatch(selectCurrentGuideGroup(id)),
    selectCurrentCategory: (items: RenderableNavigationItem[]) => dispatch(selectCurrentCategory(items)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
