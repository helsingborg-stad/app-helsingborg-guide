// @flow
import React, { Component } from "react";
import {
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import {
  selectCurrentGuideByID,
  selectCurrentGuideGroup,
  selectCurrentCategory,
  showBottomBar,
} from "../../../actions/uiStateActions";
import NavigationListItem from "../../shared/NavigationListItem";
import { compareDistance } from "../../../utils/SortingUtils";
import { AnalyticsUtils } from "../../../utils/";

type Props = {
  navigation: any,
  currentCategory: ?NavigationCategory,
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
  dispatchShowBottomBar(visible: boolean): void,
}

class CategoryListScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    let title = null;
    const { params } = navigation.state;
    if (params) {
      ({ title } = params);
    }
    return {
      title,
    };
  }

  constructor(props: Props) {
    super(props);

    const { currentCategory } = props;
    if (currentCategory) {
      const { name: title } = currentCategory;
      props.navigation.setParams({ title });
    }
  }

  componentWillUnmount() {
    this.props.dispatchShowBottomBar(true);
  }


  onPressItem = (item: NavigationItem): void => {
    switch (item.type) {
      case "guide":
      {
        this.props.selectGuide(item.id);
        const { guide } = item;
        if (guide) {
          const { guideType } = guide;
          if (guideType === "guide") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props.navigation.navigate("GuideDetailsScreen");
          } else if (guideType === "trail") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props.navigation.navigate("TrailScreen");
          }
        }
        break;
      }
      case "guidegroup":
        this.props.selectGuideGroup(item.id);
        if (item.guideGroup) {
          AnalyticsUtils.logEvent("view_location", { name: item.guideGroup.slug });
        }
        this.props.navigation.navigate("LocationScreen");
        break;
      default:
    }
  }

  render() {
    const { currentCategory } = this.props;
    if (!currentCategory) return null;

    const { items } = currentCategory;
    const sortedItems = items.map(item => item).sort(compareDistance);

    return (
      <FlatList
        style={styles.container}
        renderItem={({ item }) => (<NavigationListItem
          item={item}
          onPressItem={this.onPressItem}
        />)}
        keyExtractor={item => String(item.id)}
        data={sortedItems}
      />);
  }
}


function mapStateToProps(state: RootState) {
  const { uiState, navigation } = state;
  const { currentCategory } = uiState;
  const category = navigation.navigationCategories.find(cat => cat.id === currentCategory);

  return {
    currentCategory: category,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectGuide: (id: number) => dispatch(selectCurrentGuideByID(id)),
    selectGuideGroup: (id: number) => dispatch(selectCurrentGuideGroup(id)),
    selectCurrentCategory: (category: NavigationCategory) => dispatch(selectCurrentCategory(category.id)),
    dispatchShowBottomBar: (visible: boolean) => dispatch(showBottomBar(visible)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryListScreen);
