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
import { selectCurrentGuideByID, selectCurrentGuideGroup } from "../../../actions/uiStateActions";

const settingsIcon = require("../../../images/settings.png");

type Props = {
  navigation: any,
  showLoadingSpinner: boolean,
  navigationSections: NavigationSection[],
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void
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

  onPressItem = (item: NavigationSectionItem): void => {
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

  renderGuideCount = (item: NavigationSectionItem) => {
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
  renderNavigationItem = (item: NavigationSectionItem) => (
    <TouchableOpacity style={styles.listItemContainer} onPress={() => this.onPressItem(item)}>
      <Image style={styles.listItemImage} source={{ uri: item.image }} />
      <View style={styles.listItemTextContainer}>
        <Text style={styles.listItemTitle}>{item.title}</Text>
        {this.renderGuideCount(item)}
      </View>
    </TouchableOpacity>
  )

  renderSectionHeader = (section: { title: string }) =>
    (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    )

  render() {
    if (this.props.showLoadingSpinner) {
      return (<ActivityIndicator style={styles.loadingSpinner} />);
    }

    const { navigationSections } = this.props;
    const categories = navigationSections.map(cat => ({ title: cat.name, data: cat.items }));
    return (
      <SectionList
        style={styles.container}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
        renderItem={({ item }) => this.renderNavigationItem(item)}
        keyExtractor={item => item.id}
        sections={categories}
      />);
    /* TODO render section list footer, "VIEW ALL" */
  }
}

function parseNavigationSection(categories: NavigationCategory[], guideGroups: GuideGroup[], guides: Guide[]): NavigationSection[] {
  // TODO move this to a redux store and reducer...
  console.log("parseNavigationSection");

  const sections: NavigationSection[] = categories.map((cat) => {
    const items: NavigationSectionItem[] = [];
    cat.items.forEach((item) => {
      const { id, type } = item;

      let result: ?NavigationSectionItem;
      if (type === "guide") {
        const g = guides.find(i => i.id === id);
        if (g) {
          result = {
            id,
            image: g.images.medium,
            title: g.name,
            type: g.guideType,
            guidesCount: g.contentObjects.length,
          };
        }
      } else if (type === "guidegroup") {
        const gg = guideGroups.find(i => i.id === id);
        if (gg) {
          const guidesCount = guides.filter(g => g.guideGroupId === gg.id).length;
          result = {
            id,
            image: gg.images.medium,
            title: gg.name,
            type,
            guidesCount,
          };
        }
      }

      if (result) {
        items.push(result);
      } else {
        console.log("Did not find: ", item);
      }
    });

    const section: NavigationSection =
      {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        items,
      };
    return section;
  });

  return sections;
}

function mapStateToProps(state: RootState) {
  const { navigation, guideGroups, guides } = state;
  const { isFetching, categories } = navigation;

  // repackaging data , i.e. embed the guides into the navigation tree
  const sections: NavigationSection[] = parseNavigationSection(categories, guideGroups.items, guides.items);

  return {
    showLoadingSpinner: isFetching,
    navigationSections: sections,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectGuide: (id: number) => dispatch(selectCurrentGuideByID(id)),
    selectGuideGroup: (id: number) => dispatch(selectCurrentGuideGroup(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
