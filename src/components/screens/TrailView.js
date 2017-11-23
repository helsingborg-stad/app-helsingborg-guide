import React, {
    Component,
} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    LayoutAnimation,
    Linking,
    Platform,
    FlatList,
} from "react-native";
import PropTypes from "prop-types";
import MapView from "react-native-maps";
import {
    bindActionCreators,
} from "redux";
import {
    connect,
} from "react-redux";
import * as _ from "lodash";
import * as internetActions from "../../actions/internetActions";
import * as subLocationActions from "../../actions/subLoactionActions";
import {
    Colors,
    TabBarStyles,
    TextStyles,
} from "../../styles/";
import {
    StyleSheetUtils,
} from "../../utils/";

const defaultMargin = 20;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    map: {
        height: 300,
    },
    flatList: {
        flex: 1,
    },
    listItem: {
        margin: defaultMargin,
    },
    listItemTitle: StyleSheetUtils.flatten([
        TextStyles.body, {
        }],
    ),
});


class TrailView extends Component {
    static propTypes = {
        navigation: PropTypes.object, // eslint-disable-line react/require-default-props
        subLocations: PropTypes.array.isRequired,
        internet: PropTypes.bool.isRequired,
        geolocation: PropTypes.any.isRequired,
    }

    static navigationOptions = ({ navigation }) => {
        const { guide } = navigation.state.params;
        const name = guide ? guide.name : undefined;
        return {
            title: name,
            ...TabBarStyles.guide,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            subLocation: this.props.subLocations[0],
        };
    }

    renderRow = contentObject => {
        return (
            <View style={styles.listItem}>
                <Text style={styles.listItemTitle}>{contentObject.item.title}</Text>
            </View>
        );
    }

    render() {
        const { contentObjects } = this.state.subLocation;
        let data = _.values(contentObjects);
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    showsUserLocation
                    initialRegion={{
                        latitude: 56.04765769999999,
                        longitude: 12.6888389,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
                <FlatList
                    style={styles.flatList}
                    data={data}
                    renderItem={this.renderRow}
                    keyExtractor={item => `i${item.id}`}
                />
            </View>
        );
    }
}

function getFilteredSubLocations(list, parentId) {
    if (!list || !list.length) return [];
    const filtered = _.filter(list, item => item.guidegroup[0].id === parentId);
    return _.sortBy(filtered, item => item.title.plain_text);
}

function mapStateToProps(state, ownProps) {
    const { guide } = ownProps.navigation.state.params;
    return {
        subLocations: getFilteredSubLocations(state.subLocations, guide.id) || [],
        internet: state.internet.connected,
        geolocation: state.geolocation,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        subLocationActions: bindActionCreators(subLocationActions, dispatch),
        internetActions: bindActionCreators(internetActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrailView);
