import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback, ScrollView } from "react-native";
import { Checkbox } from "react-native-paper";
import ArrowUp from "@assets/images/arrow_up";
import ArrowDown from "@assets/images/arrow_down";
import LangService from "@services/langService";
import styles from "./style";


const Dropdown = (props) => {
  const {
    options,
    selected,
    onPress,
    textMode,
  } = props;

  const [open, setOpen] = useState(false);



  console.log("selected in dropdown", selected)


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sök alla aktiviteter</Text>
      <TouchableWithoutFeedback
        onPress={() => setOpen(!open)}
      >
        <View style={styles.select}>
          <View style={styles.arrow}>
            {open ? <ArrowUp /> : <ArrowDown />}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {open && <View style={styles.options}>
        <ScrollView style={styles.scroll}>
        {options.map((option, index) => (
          <View
            key={index}
            style={styles.item}
          >
            <Checkbox.Android
              key={index}
              status={selected.includes(option) ? "checked" : "unchecked"}
              onPress={() => onPress(option)}
              uncheckedColor={"grey"}
              color={"#A40082"}
              mode={"android"} />
            <Text style={styles.itemText}>
              {textMode === "translate" ? LangService.strings[option] : option }
            </Text>
          </View>
        ))}
        </ScrollView>
      </View>
      }
    </View>

  );
};

export default Dropdown;
