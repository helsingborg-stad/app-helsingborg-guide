import { View } from "react-native";
import styles from "../../screens/HomeScreen/styles";
import SegmentControlPill from "@shared-components/SegmentControlPill";


const TopBar = () => {

  return (
    <View style={styles.topBarNavigation}>
      <SegmentControlPill
        initialSelectedIndex={currentHomeTab}
        onSegmentIndexChange={selectCurrentTab}
        labels={navigationCategoryLabels}
      />
    </View>
  )
}

export default TopBar;
