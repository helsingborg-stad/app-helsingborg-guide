// @flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  Image,
  SectionList,
  Text,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import LangService from "../../../services/langService";
import { HeaderStyles } from "../../../styles";
import styles from "./styles";

const settingsIcon = require("../../../images/settings.png");

type Props = {
  showLoadingSpinner: boolean,
  navigationSections: NavigationSection[]
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

  render() {
    console.log("render");

    if (this.props.showLoadingSpinner) {
      return (<ActivityIndicator style={styles.loadingSpinner} />);
    }

    const { navigationSections } = this.props;
    const categories = navigationSections.map(cat => ({ title: cat.name, data: cat.items }));
    return (
      <SectionList
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
        renderItem={({ item }) => (<Text>{item.id}</Text>)
        }
        keyExtractor={item => item.id}
        sections={categories}
      />);
    /* TODO render section list footer, "VIEW ALL" */
  }
}

function parseNavigationSection(categories: NavigationCategory[], guideGroups: GuideGroup[], guides: Guide[]): NavigationSection[] {
  console.log("guide id's");
  guides.forEach(i => console.log(i.id));
  console.log();

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
          };
        }
      } else if (type === "guidegroup") {
        const g = guideGroups.find(i => i.id === id);
        if (g) {
          result = {
            id,
            image: g.images.medium,
            title: g.name,
            type,
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
  console.log("mapStateToProps");

  const { navigation, guideGroups, guides } = state;
  const { isFetching, categories } = navigation;

  // repackaging data , i.e. embed the guides into the navigation tree
  const sections: NavigationSection[] = parseNavigationSection(categories, guideGroups.items, guides.items);

  return {
    showLoadingSpinner: isFetching,
    navigationSections: sections,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
