// @flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import LangService from "@services/langService";
import { HeaderStyles } from "@assets/styles";
import styles from "./styles";
import {
  selectCurrentGuideByID,
  selectCurrentGuideGroup,
  selectCurrentCategory,
  showBottomBar
} from "@actions/uiStateActions";
import NavigationListItem from "@shared-components/NavigationListItem";
import { compareDistance } from "@utils/SortingUtils";
import { AnalyticsUtils } from "@utils";

type Props = {
  navigation: any,
  showLoadingSpinner: boolean,
  navigationSections: NavigationCategory[],
  noContent: boolean,
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
  selectCurrentCategory(section: NavigationCategory): void,
  dispatchShowBottomBar(visible: boolean): void
};

class HomeScreen extends Component<Props> {
  static navigationOptions = () => {
    const title = LangService.strings.APP_NAME;
    return {
      ...HeaderStyles.noElevation,
      title
    };
  };

  componentDidMount() {
    this.props.dispatchShowBottomBar(true);
  }

  onPressItem = (item: NavigationItem): void => {
    switch (item.type) {
      case "guide": {
        const { guide } = item;
        if (guide) {
          this.props.selectGuide(guide.id);
          const type = guide.guideType;
          if (type === "guide") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props.navigation.navigate("GuideDetailsScreen", {
              title: guide.name,
              bottomBarOnUnmount: true
            });
            this.props.dispatchShowBottomBar(false);
          } else if (type === "trail") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props.navigation.navigate("TrailScreen", {
              title: guide.name,
              bottomBarOnUnmount: true
            });
            this.props.dispatchShowBottomBar(false);
          }
        }
        break;
      }
      case "guidegroup":
        this.props.selectGuideGroup(item.id);
        if (item.guideGroup) {
          const title = item.guideGroup.name;
          AnalyticsUtils.logEvent("view_location", {
            name: item.guideGroup.slug
          });
          this.props.navigation.navigate("LocationScreen", {
            title,
            bottomBarOnUnmount: true
          });
          this.props.dispatchShowBottomBar(false);
        }
        break;
      default:
        break;
    }
  };

  onPressViewAll = (category: NavigationCategory) => {
    this.props.selectCurrentCategory(category);
    this.props.navigation.navigate("CategoryListScreen");
    this.props.dispatchShowBottomBar(false);
  };

  renderSectionHeader = (section: {
    title: string,
    category: NavigationCategory,
    showSpinner?: boolean
  }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionDescription}>
        {section.category.description}
      </Text>
      {section.showSpinner ? (
        <ActivityIndicator style={styles.sectionLoadingSpinner} />
      ) : null}
    </View>
  );

  renderSectionFooter = (section: {
    title: string,
    data: NavigationItem[],
    category: NavigationCategory,
    hideFooter?: boolean
  }) => {
    if (section.hideFooter) {
      return null;
    }

    return (
      <View style={styles.sectionFooterContainer}>
        <TouchableOpacity
          style={styles.sectionFooterButton}
          onPress={() => this.onPressViewAll(section.category)}
        >
          <Text style={styles.sectionFooterText}>
            {LangService.strings.VIEW_ALL.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    if (this.props.showLoadingSpinner) {
      return <ActivityIndicator style={styles.loadingSpinner} />;
    }

    // TODO move to mapStateToProps()
    const { navigationSections, noContent } = this.props;
    const sections = [];
    navigationSections.forEach(cat => {
      const data = cat.items
        .filter(item => item.guide || item.guideGroup)
        .sort(compareDistance)
        .slice(0, 2);
      if (data.length > 0) {
        sections.push({ title: cat.name, data, category: cat });
      } else if (noContent) {
        sections.push({
          title: cat.name,
          data,
          category: cat,
          showSpinner: true,
          hideFooter: true
        });
      }
    });

    return (
      <SectionList
        style={styles.container}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
        renderItem={({ item }) => (
          <NavigationListItem item={item} onPressItem={this.onPressItem} />
        )}
        renderSectionFooter={({ section }) =>
          // $FlowFixMe flow doesn't understand me
          this.renderSectionFooter(section)
        }
        keyExtractor={item => item.id}
        sections={sections}
      />
    );
  }
}

function mapStateToProps(state: RootState) {
  const { navigation, guides, guideGroups } = state;
  const { isFetching, navigationCategories } = navigation;

  const noContent = guides.items.length === 0 || guideGroups.items.length === 0;

  return {
    showLoadingSpinner: isFetching,
    navigationSections: navigationCategories,
    noContent
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectGuide: (id: number) => dispatch(selectCurrentGuideByID(id)),
    selectGuideGroup: (id: number) => dispatch(selectCurrentGuideGroup(id)),
    selectCurrentCategory: (category: NavigationCategory) =>
      dispatch(selectCurrentCategory(category.id)),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
