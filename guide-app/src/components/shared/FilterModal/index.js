import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import Accordion from "@shared-components/Accordion";
import Calendar from "@shared-components/Calendar";
import LangService from "@services/langService";
import Details from "./Details";
import Time from "./Time";
import ExpandIcon from "@assets/images/expand_icon_open.svg";
import styles from "./style";


const options = {
  top: [
    "TOPLIST",
    "RANDOMIZE",
  ],
  main: [
    "SHOPPING",
    "EXHIBITIONS",
    "SIGHTSEEINGS",
    "PADEL_TRACKS",
    "PLAYGROUNDS",
    "BATHING_AREAS",
    "THEATER",
    "CINEMA",
    "EXERCISE",
    "GROCERIES",
  ],
};

const sections = [
  {
    id: "details",
    title: "Detaljerad Information",
    content: "lol",
  },
  {
    id: "time",
    title: "Tid och Datum",
    content: "lol",
  },
];


const FilterModal = (props) => {
  const [selected, setSelected] = useState([]);
  const [activeSections, setActiveSections] = useState([]);

  const {
    isModalVisible,
    setModalVisible,
    coverScreen,
    backdropColor,
    backdropOpacity,
  } = props;

  const setFilters = (item) => {
    const copy = [...selected];
    !copy.includes(item) ? copy.push(item) : copy.splice(copy.indexOf(item), 1);
    setSelected(copy);
  };

  const filterButton = (item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => setFilters(item)}
      style={[styles.filterButton, { marginLeft: index % 2 !== 0 ? 20 : 0 }, selected.includes(item) && styles.selected]}>
      <Text
        style={[styles.filterButtonText, selected.includes(item) && styles.selectedText]}>{LangService.strings[item]}</Text>
    </TouchableOpacity>
  );

  const renderSectionTitle = () => {
    <View>
      <Text></Text>
    </View>;
  };

  const renderHeader = (section, index) => {
    const { title } = section;
    console.log("section", section, activeSections);
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
        <ExpandIcon style={{ transform: [{ rotateX: activeSections.includes(index) ? "0deg" : "180deg" }] }} />
      </View>
    );
  };

  const renderContent = (section) => {
    const { id } = section;
    const content = () => {
      switch (id) {
        case "details":
          return <Details />;
        case "time":
          return <Time renderCalendar={activeSections.includes(1)} />;
      }
    };
    return (
      <View>
        {content()}
      </View>
    );
  };

  const renderFooter = (section, index) => {
    return (
      index + 1 !== sections.length ? <View style={styles.seperator} /> : null
    );
  };

  return (
    <View style={isModalVisible && styles.container}>
      <Modal
        isVisible={isModalVisible}
        coverScreen={coverScreen}
        {...(backdropColor && { backdropColor: backdropColor })}
        {...(backdropOpacity && { backdropOpacity: backdropOpacity })}
      >
        <SafeAreaView style={styles.safearea}>
          <View style={styles.container}>
            <View style={styles.top}>
              <TouchableOpacity
                style={styles.close}
                onPress={() => setModalVisible(false)}
              >
                <Icon
                  name={"close-circle"}
                  size={24}
                />
              </TouchableOpacity>
              <Text style={styles.filterSettings}>Filterinställningar</Text>
              <TouchableOpacity
                style={styles.reset}
              >
                <Text style={styles.resetText}>Återställ</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollcontainer}>
              <>
                <View style={styles.filterButtons}>
                  <View style={styles.buttonsTop}>
                    {options.top.map((item, index) => (
                      filterButton(item, index)
                    ))}
                  </View>
                  <View style={styles.seperator} />
                  <View style={styles.buttonsMain}>
                    {options.main.map((item, index) => (
                      filterButton(item, index)
                    ))}
                  </View>
                  <View style={styles.seperator} />
                </View>
                <View style={styles.filterDetails}>
                  <Accordion
                    sections={sections}
                    activeSections={activeSections}
                    onChange={(active) => setActiveSections(active)}
                    renderSectionTitle={renderSectionTitle}
                    renderHeader={(e, index) => renderHeader(e, index)}
                    renderContent={(e) => renderContent(e)}
                    renderFooter={(e, index) => renderFooter(e, index)}
                    underlayColor={"transparent"}
                  />
                </View>
              </>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default FilterModal;
