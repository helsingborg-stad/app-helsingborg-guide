import React from 'react';
import { Linking, ScrollView, Text, View, Image, StatusBar } from "react-native";
import SharingService from "@services/SharingService";
import ImageSwiper from "@shared-components/ImageSwiper";
import LinkTouchable from "@shared-components/LinkTouchable";
import LangService from "@services/langService";
import styles from "./styles";
import MapIcon from "@assets/images/map_icon_black.png"
import ClockIcon from "@assets/images/clock_icon_black.png"



const CalendarDetailsScreen = ({ navigation }) => {

  const { event } = navigation.state.params;

  console.log("params", event)


  function displayLocation(location: string, dateString: string, hoursString: string) {
    const loc = (
      <View style={styles.location}>
        <View style={styles.locationContainer}>
          <Image source={MapIcon} style={styles.locationIcon} />
          <View style={styles.locationTextContainer}>
          <Text style={[styles.locationText, styles.locationTextTop]}>{LangService.strings.LOCATION}</Text>
            <Text style={[styles.locationText, styles.locationTextBottom]}>{dateString + ", " + hoursString}</Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Image source={ClockIcon} style={styles.timeIcon} />
          <View style={styles.timeTextContainer}>
            <Text style={[styles.timeText, styles.timeTextTop]}>{LangService.strings.DATE}</Text>
            <Text style={[styles.timeText, styles.timeTextBottom]}>{location}</Text>
          </View>
        </View>
      </View>
    );
    return loc;
  }
  function displayTitle(
    name: string,
    location: string,
    date: string,
    dateString: string,
    hoursString: string,
  )

  {
    console.log("date event", date)

    return (
      <View style={styles.title}>
        <View style={styles.titleWrapper}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateTextDay}>{date.split(" ")[0]}</Text>
            <Text style={styles.dateTextMonth}>{date.split(" ")[1]}</Text>
          </View>
          <View style={styles.titleContainer}><Text style={styles.titleText}>{name}</Text></View>
        </View>
        {displayLocation(location, dateString, hoursString)}
      </View>
    );
  }

  function displayText(description?: string) {
    return <Text style={styles.article}>{description}</Text>;
  }

  function displayLink(
    link: any,
    name: any,
  ) {
    return <LinkTouchable
        title={name}
        onPress={() => {
          Linking.openURL(link);
        }}
      />
  }

  console.log("image???", event?.imageUrl?.uri)

  return (
    <View style={styles.viewContainer}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.container}>
        <View
          style={styles.imageContainer}>
         <Image source={event?.imageUrl} style={styles.eventImage} />
          {event?.imageUrl && (
            <View style={styles.shareBtn}>
              <SharingService
                title={event.name}
                image={{large: event.imageUrl.uri}}
                sender={this}
                senderType ="share_object" />
            </View>
          )}
        </View>

        <View style={styles.bodyContainer}>
          {displayTitle(
            event?.name,
            event?.title,
            event?.date,
            event?.dateString,
            event?.hoursString
          )}
          <View style={styles.articleContainer}>
            {event?.description
              ? displayText(event.description)
              : null}
            {event?.eventUrl
              ? displayLink(
                event?.eventUrl,
                event?.name
              )
              : null}
            <View style={styles.navGuideContainer}>
              {/*{guideButtons(props)}*/}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

CalendarDetailsScreen['navigationOptions'] = screenProps => (
  console.log("event??", screenProps),
  {
  title: screenProps?.navigation?.state?.params?.event?.name || "Event",
})

export default CalendarDetailsScreen;
