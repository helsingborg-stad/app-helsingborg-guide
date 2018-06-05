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
} from "../../../actions/uiStateActions";
import NavigationListItem from "../../shared/NavigationListItem";

type Props = {
  navigation: any,
  currentCategory: ?NavigationCategory,
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
}

class HomeScreen extends Component<Props> {
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

  onPressItem = (item: NavigationItem): void => {
    switch (item.type) {
      case "guide":
        this.props.selectGuide(item.id);
        this.props.navigation.navigate("GuideDetailsScreen");
        break;
      case "trail":
        // TODO fix navigation
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

  render() {
    const { currentCategory } = this.props;
    if (!currentCategory) return null;

    return (
      <FlatList
        style={styles.container}
        renderItem={({ item }) => (<NavigationListItem
          item={item}
          onPressItem={this.onPressItem}
        />)}
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
    selectCurrentCategory: (category: NavigationCategory) => dispatch(selectCurrentCategory(category)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
