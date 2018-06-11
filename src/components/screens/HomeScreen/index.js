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
import NavigationListItem from "../../shared/NavigationListItem";
import { compareDistance } from "../../../utils/SortingUtils";

const settingsIcon = require("../../../images/settings.png");

type Props = {
  navigation: any,
  showLoadingSpinner: boolean,
  navigationSections: NavigationCategory[],
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
  selectCurrentCategory(section: NavigationCategory): void
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

  onPressItem = (item: NavigationItem): void => {
    switch (item.type) {
      case "guide":
      {
        const { guide } = item;
        if (guide) {
          this.props.selectGuide(guide.id);
          const type = guide.guideType;
          if (type === "guide") {
            this.props.navigation.navigate("GuideDetailsScreen");
          } else if (type === "trail") {
            this.props.navigation.navigate("TrailScreen");
          }
        }
        break;
      }
      case "guidegroup":
        this.props.selectGuideGroup(item.id);
        this.props.navigation.navigate("LocationScreen");
        break;
      default:
        break;
    }
  }

  onPressViewAll = (category: NavigationCategory) => {
    this.props.selectCurrentCategory(category);
    this.props.navigation.navigate("CategoryListScreen");
  }

  renderSectionHeader = (section: { title: string, category: NavigationCategory }) =>
    (
      <View style={styles.sectionContainer} >
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionDescription}>{section.category.description}</Text>
      </View>
    )

  renderSectionFooter = (section: { title: string, data: NavigationItem[], category: NavigationCategory }) => (
    <View style={styles.sectionFooterContainer}>
      <TouchableOpacity
        style={styles.sectionFooterButton}
        onPress={() => this.onPressViewAll(section.category)}
      >
        <Text style={styles.sectionFooterText}>{LangService.strings.VIEW_ALL.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    if (this.props.showLoadingSpinner) {
      return (<ActivityIndicator style={styles.loadingSpinner} />);
    }

    const { navigationSections } = this.props;
    const sections = navigationSections.map((cat) => {
      const data = cat.items
        .sort(compareDistance)
        .slice(0, 2);
      return { title: cat.name, data, category: cat };
    });
    return (
      <SectionList
        style={styles.container}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
        renderItem={({ item }) => (<NavigationListItem
          item={item}
          onPressItem={this.onPressItem}
        />)
        }
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
  const { isFetching, navigationCategories } = navigation;

  return {
    showLoadingSpinner: isFetching,
    navigationSections: navigationCategories,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectGuide: (id: number) => dispatch(selectCurrentGuideByID(id)),
    selectGuideGroup: (id: number) => dispatch(selectCurrentGuideGroup(id)),
    selectCurrentCategory: (category: NavigationCategory) => dispatch(selectCurrentCategory(category.id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
