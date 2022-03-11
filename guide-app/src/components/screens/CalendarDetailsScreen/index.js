import React, { useEffect, useState } from "react";
import { Linking, ScrollView, Text, View, Image, StatusBar } from "react-native";
import SharingService from "@services/SharingService";
import Accordion from "@shared-components/Accordion";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import LinkTouchable from "@shared-components/LinkTouchable";
import LangService from "@services/langService";
import styles from "./styles";
import MapIcon from "@assets/images/map_icon_black.png";
import ClockIcon from "@assets/images/clock_icon_black.png";
import { Colors } from "@assets/styles";
import ArrowUp from "@assets/images/arrow_up";


const CalendarDetailsScreen = ({ navigation }) => {

  const { event } = navigation.state.params;

  const [activeSections, setActiveSections] = useState([]);
  const [sections, setSections] = useState([]);


  useEffect(() => {
    let arr = [];
    event?.location && arr.push({ id: "location", title: "LOCATION", content: "" });
    event?.organizers?.length && arr.push({ id: "organizers", title: "ORGANIZERS", content: "" });
    setSections(arr);
  }, []);


  function displayLocation(location: string, dateString: string, hoursString: string) {
    const loc = (
      <View style={styles.location}>
        <View style={styles.locationContainer}>
          <Image source={MapIcon} style={styles.locationIcon} />
          <View style={styles.locationTextContainer}>
            <Text style={[styles.locationText, styles.locationTextTop]}>{LangService.strings.LOCATION}</Text>
            <Text style={[styles.locationText, styles.locationTextBottom]}>{location}</Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Image source={ClockIcon} style={styles.timeIcon} />
          <View style={styles.timeTextContainer}>
            <Text style={[styles.timeText, styles.timeTextTop]}>{LangService.strings.DATE}</Text>
            <Text style={[styles.timeText, styles.timeTextBottom]}>{dateString + ", " + hoursString}</Text>
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
    hoursString: string
  ) {

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
    name: any
  ) {
    return <LinkTouchable
      title={name}
      onPress={() => {
        Linking.openURL(link);
      }}
    />;
  }

  const renderSectionTitle = () => {
    return (
      <View>
        <Text></Text>
      </View>
    );
  };


  function renderHeader(section, index) {
    const { title } = section;
    console.log("section", section, activeSections);
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{LangService.strings[title]}</Text>
        <ArrowUp style={{ transform: [{ rotateX: activeSections.includes(index) ? "0deg" : "180deg" }] }} />
      </View>
    );
  }

  function renderContent(section, index) {
    console.log("render", event?.organizers)
    const { id } = section;
    const content = () => {
      switch (id) {
        case "organizers":
          return <View style={styles.organizersContent}>
            {event?.organizers.map((organizer, index) => (
              <View
                key={index}
                style={styles.organizer}
              >
                {organizer.organizer ? <Text style={styles.organizerName}>{organizer.organizer}</Text> : null}
                {organizer.organizerPhone ? <Text style={styles.organizerPhone}>{organizer.organizerPhone}</Text> : null}
                {organizer.organizerMail ? <Text style={styles.organizerMail}>{organizer.organizerMail}</Text> : null}
                {organizer.organizerLink ? <Text style={styles.organizerLink}>{organizer.organizerLink}</Text> : null}
              </View>
            ))}
          </View>;
        case "location":
          const { location } = event;
          return <View style={styles.locationContent}>
            {location?.title ? <Text style={styles.locationTitle}>{location.title}</Text> : null}
            {location?.streetAddress && location?.streetAddress !== location?.title ? <Text style={styles.locationStreetAddress}>{location.streetAddress}</Text> : null}
            {location?.city ? <Text style={styles.locationCity}>{location.city}</Text> : null}
            {location?.postalCode ? <Text style={styles.locationPostal}>{location?.postalCode}</Text> : null}
          </View>
      }
    };
    return (
      <View style={styles.sectionContent}>
        {content()}
      </View>
    );
  }

  function renderFooter(section, index) {
    return (
      index + 1 !== sections.length ? <View style={styles.seperator} /> : null
    );

  }

  return (
    <View style={styles.viewContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.themeSecondary}
      />
      <ScrollView style={styles.container}>
        <View
          style={styles.imageContainer}>
          <Image source={event?.imageUrl} style={styles.eventImage} />
          {event?.imageUrl && (
            <View style={styles.shareBtn}>
              <SharingService
                title={event.name}
                image={{ large: event.imageUrl.uri }}
                sender={this}
                senderType="share_object" />
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
          </View>

          <View style={styles.infoContainer}>
            <Accordion
              sections={sections}
              activeSections={activeSections}
              onChange={(active) => setActiveSections(active)}
              renderSectionTitle={renderSectionTitle}
              renderHeader={(e, index) => renderHeader(e, index)}
              renderContent={(e, index) => renderContent(e, index)}
              renderFooter={(e, index) => renderFooter(e, index)}
              underlayColor={"transparent"}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

CalendarDetailsScreen["navigationOptions"] = screenProps => (
  {
    title: screenProps?.navigation?.state?.params?.event?.name || "Event",
    headerRight: () => <View style={{ width: 36 }} />,
    headerLeft: () => <HeaderBackButton
      navigation={screenProps.navigation}
      path={screenProps?.navigation?.state?.params?.path} />
  });

export default CalendarDetailsScreen;
