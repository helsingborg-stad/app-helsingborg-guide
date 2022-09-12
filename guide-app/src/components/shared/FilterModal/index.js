import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import Accordion from "@shared-components/Accordion";
import Dropdown from "@shared-components/Dropdown";
import LangService from "@services/langService";
import Details from "./Details";
import Time from "./Time";
import ArrowUp from "@assets/images/arrow_up";
import styles from "./style";

const options = {
  top: ["TOPLIST", "RANDOMIZE"],
  main: ["SHOPPING", "EXHIBITIONS", "SIGHTSEEINGS", "PADEL_TRACKS"],
  additional: [
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
    title: "DETAILED_INFORMATION",
    content: "",
  },
  {
    id: "time",
    title: "TIME_AND_DATE",
    content: "",
  },
];

const FilterModal = (props) => {
  const [selected, setSelected] = useState({
    main: [],
    additional: [],
    dates: [],
    details: [],
  });
  const [activeSections, setActiveSections] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  const {
    isModalVisible,
    setModalVisible,
    coverScreen,
    backdropColor,
    backdropOpacity,
  } = props;

  const setActivities = (item, type) => {
    const copy = { ...selected };
    switch (type) {
      case "main":
        !copy.main.includes(item)
          ? copy.main.push(item)
          : copy.main.splice(copy.main.indexOf(item), 1);
      case "additional":
        !copy.additional.includes(item)
          ? copy.additional.push(item)
          : copy.additional.splice(copy.additional.indexOf(item), 1);
      default:
        null;
    }
    setSelected(copy);
  };

  const filterButton = (item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => setActivities(item, "main")}
      style={[
        styles.filterButton,
        { marginLeft: index % 2 !== 0 ? 20 : 0 },
        selected.main.includes(item) && styles.selected,
      ]}
    >
      <Text
        style={[
          styles.filterButtonText,
          selected.main.includes(item) && styles.selectedText,
        ]}
      >
        {LangService.strings[item]}
      </Text>
    </TouchableOpacity>
  );

  const renderSectionTitle = () => {
    <View>
      <Text />
    </View>;
  };

  const renderHeader = (section, index) => {
    const { title } = section;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>
          {LangService.strings[title]}
        </Text>
        <ArrowUp
          style={{
            transform: [
              { rotateX: activeSections.includes(index) ? "0deg" : "180deg" },
            ],
          }}
        />
      </View>
    );
  };

  const renderContent = (section, index) => {
    const { id } = section;
    const content = () => {
      switch (id) {
        case "details":
          return (
            <Details
              key={index}
              selected={selected}
              setSelected={setSelected}
            />
          );
        case "time":
          return (
            <Time
              key={index}
              selected={selected}
              setSelected={setSelected}
              renderCalendar={activeSections.includes(1)}
            />
          );
      }
    };
    return <View>{content()}</View>;
  };

  const renderFooter = (section, index) => {
    return index + 1 !== sections.length ? (
      <View style={styles.seperator} />
    ) : null;
  };

  const resetSettings = () => {
    setSelected({ main: [], additional: [], dates: [], details: [] });
    setActiveSections([]);
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
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              setOpenDropdown(false);
            }}
            style={styles.container}
          >
            <View style={styles.top}>
              <TouchableOpacity
                style={styles.close}
                onPress={() => setModalVisible(false)}
              >
                <Icon name={"close-circle"} size={24} />
              </TouchableOpacity>
              <Text style={styles.filterSettings}>
                {LangService.strings.FILTER_SETTINGS}
              </Text>
              <TouchableOpacity style={styles.reset} onPress={resetSettings}>
                <Text style={styles.resetText}>
                  {LangService.strings.RESET}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollcontainer}
            >
              <>
                <View style={styles.filterButtons}>
                  <Text style={styles.buttonsTitle}>
                    {LangService.strings.MOST_POPULAR_ACTIVITIES}
                  </Text>
                  <View style={styles.buttonsMain}>
                    {options.main.map((item, index) =>
                      filterButton(item, index)
                    )}
                  </View>
                  <View style={styles.filterDropdown}>
                    <Dropdown
                      textMode={"translate"}
                      options={options.additional}
                      selected={selected.additional}
                      placeholder={LangService.strings.SEARCH_ALL_ACTIVITES}
                      onPress={(item) => setActivities(item, "additional")}
                      open={openDropdown}
                      setOpen={setOpenDropdown}
                    />
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
                    renderContent={(e, index) => renderContent(e, index)}
                    renderFooter={(e, index) => renderFooter(e, index)}
                    underlayColor={"transparent"}
                  />
                </View>
              </>
            </ScrollView>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default FilterModal;
