// @flow
import React, {useState, useEffect} from "react";
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {connect} from "react-redux";
import {addDays, subDays} from "date-fns";
import {throttle} from "lodash/function";

import CalendarEvent from "@shared-components/CalendarEvent";
import CalendarDatePicker from "@shared-components/CalendarDatePicker";
import Scrollable from "@shared-components/Scrollable";
import LangService from "@services/langService";
import {Colors, TextStyles} from "@assets/styles";
import {showBottomBar} from "@actions/uiStateActions";
import {fetchEvents, fetchEventsReset} from "@actions/eventActions";
import {StyleSheetUtils} from "@utils";
import {trackScreen} from "@utils/MatomoUtils";
import useDeepLinking from "@hooks/useDeepLinking";

const styles = StyleSheet.create({
    flex: {flex: 1},
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        backgroundColor: Colors.white,
        marginBottom: 100,
        paddingHorizontal: 4,
    },
    loadingSpinner: {
        flex: 1,
    },
    noContent: {
        backgroundColor: Colors.grayEA,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.6
    },
    noContentText: StyleSheetUtils.flatten([
        TextStyles.defaultFontFamily,
        {
            color: Colors.black26,
            fontWeight: "500",
            fontSize: 19,
            lineHeight: 22,
            textAlign: "center",
            width: "50%"
        }
    ]),

    navigationWrapper: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        paddingVertical: 5,
        backgroundColor: 'white',
    },

    navigation: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
    },

    navigationBarWrapper: {
        flexDirection: 'column',
    },

    navigationBarStep: {
        textAlign: 'center',
    },

});

type LayoutProps = {
    children?: React.Node
};

function Layout({children}: LayoutProps) {
    return (
        <SafeAreaView style={styles.flex}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white}/>
            {children}
        </SafeAreaView>
    );
}

function NoContent() {
    return (
        <View style={{...styles.flex, ...styles.noContent}}>
            <Text style={styles.noContentText}>
                {LangService.strings.CALENDAR_NO_CONTENT}
            </Text>
        </View>
    );
}

type Props = {
    navigation: any,
    items: Event[],
    showLoadingSpinner: boolean,
    noContent: boolean,
    currentLanguage: string,
    dispatchShowBottomBar(visible: boolean): void,
    getEvents(currentLanguage: string, dateStart: Date, dateEnd: Date, perPage: any, page: any): void
};

type State = {
    chosenDate: Date
};

const CalendarScreen = (props: Props, state: State) => {
    const {
        currentLanguage,
        dispatchShowBottomBar,
        getEvents,
        resetEvents,
        showLoadingSpinner,
        items,
        navigation,
        isFetching,
    } = props;

    const {params} = navigation?.state;
    const {linkingCalendar} = useDeepLinking();

    const [chosenDate, setChosenDate] = useState(new Date())
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [endOfContent, setEndOfContent] = useState(false)
    const noContent = !isFetching && events.length === 0;

    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        trackScreen("/calendar", "/calendar")
        dispatchShowBottomBar(true);
        console.log("current page", currentPage)
        getEvents(currentLanguage, chosenDate, chosenDate, ITEMS_PER_PAGE, currentPage);
        return () => {
            resetEvents();
            setEvents([])
            setEndOfContent(false)
            setCurrentPage(1)
            setChosenDate(new Date());
        }
    }, [])

    useEffect(() => {
        if (!navigation.isFocused()) {
            resetEvents();
            setEvents([])
            setEndOfContent(false)
            setCurrentPage(1)
            setChosenDate(new Date());
        }
    }, [navigation.isFocused()]);

    useEffect(() => {
        if (params?.id) {
            linkingCalendar(params)
        }
    }, [params])

    const loadMoreContent = () => {
        throttle(() => {
            console.log("LOAD MORE CONTENT")
            const nextPage = currentPage + 1;
            console.log(chosenDate, nextPage)
            getEvents(currentLanguage, chosenDate, chosenDate, ITEMS_PER_PAGE, nextPage);
            setCurrentPage(nextPage);
        }, 2500)()
    }

    useEffect(() => {
        let copy = [...events];
        if (items.length) {
            if (items !== copy) {
                items.map(item => !copy.includes(item) && copy.push(item))
                setEvents(copy)
            }
        } else if (events.length) {
            setEndOfContent(true)
        }
    }, [items]);


    const getNextDate = () => {
        const nextDate = addDays(chosenDate, 1);
        setEvents([])
        setEndOfContent(false)
        setCurrentPage(1)
        getEvents(currentLanguage, nextDate, nextDate, ITEMS_PER_PAGE, 1);
        setChosenDate(nextDate)
    };

    const getPrevDate = () => {
        const prevDate = subDays(chosenDate, 1);
        setEvents([])
        setEndOfContent(false)
        setCurrentPage(1)
        getEvents(currentLanguage, prevDate, prevDate, ITEMS_PER_PAGE, 1);
        setChosenDate(prevDate);
    };


    const datePicker = (
        <CalendarDatePicker
            chosenDate={chosenDate}
            currentLanguage={currentLanguage}
            getNextDate={() => getNextDate()}
            getPrevDate={() => getPrevDate()}
        />
    );

    if (showLoadingSpinner && !events.length) {
        return (
            <Layout>
                {datePicker}
                <ActivityIndicator style={styles.loadingSpinner}/>
            </Layout>
        );
    }

    if (noContent) {
        return (
            <Layout>
                {datePicker}
                <NoContent/>
            </Layout>
        );
    }


    const isCloseToBottom = (e) => {
        const {layoutMeasurement, contentOffset, contentSize} = e;
        const paddingToBottom = 800;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    }


    return (
        <Layout>
            {datePicker}
            <Scrollable
                refreshControl={true}
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent) && !endOfContent) {
                        loadMoreContent()
                    }
                }}
                // refreshAction={() => getEvents(currentLanguage, chosenDate, chosenDate, events.length, 1)}
            >
                <View style={styles.container}>
                    {events.length ? events.map(event => (
                        event ?
                            <CalendarEvent
                                key={Math.random()}
                                event={event}
                                currentLanguage={currentLanguage}
                                navigation={navigation}
                                path={"/calendar"}
                            /> : null
                    )) : null}
                    {isFetching && events.length && <ActivityIndicator style={{width: '100%', paddingBottom: 30}}/>}
                </View>
            </Scrollable>
        </Layout>
    );
}

function mapStateToProps(state: RootState) {
    const {navigation, events} = state;
    const {currentLanguage} = navigation;
    const {isFetching, items} = events;


    return {
        isFetching,
        showLoadingSpinner: isFetching,
        currentLanguage,
        items,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        getEvents: (currentLanguage: string, dateStart: Date, dateEnd: Date, perPage: any, page: any) =>
            dispatch(fetchEvents(currentLanguage, dateStart, dateEnd, perPage, page)),
        resetEvents: () => dispatch(fetchEventsReset()),
        dispatchShowBottomBar: (visible: boolean) =>
            dispatch(showBottomBar(visible))
    };
}

CalendarScreen["navigationOptions"] = ({navigation}) => {
    return {
        headerShown: false
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
