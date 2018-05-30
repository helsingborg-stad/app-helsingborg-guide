
import { StyleSheet } from "react-native";
import {
  Colors,
} from "../../../styles/";

const PLAYER_HEIGHT = 70;
const BTN_DIM = 36;

export default StyleSheet.create({
  playerContainer: {
    height: PLAYER_HEIGHT,
    backgroundColor: Colors.moreOffWhite,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopWidth: 2,
    borderColor: Colors.listBackgroundColor,
  },
  sliderAndTitleContainer: {
    flex: 3,
    backgroundColor: Colors.moreOffWhite,
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingVertical: 10,
  },
  sliderContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingTop: 16,
    marginBottom: 10,
    marginHorizontal: 6,
  },
  titleContainer: { flex: 1, alignItems: "center", paddingHorizontal: 15 },
  titleText: { fontSize: 12, lineHeight: 14, fontWeight: "bold" },
  disabledText: { color: "#cecece" },
  trackSlider: { flex: 1 },
  slider: { flex: 0, flexGrow: 1 },
  durationText: { fontSize: 12, paddingHorizontal: 10 },
  controlsContainer: {
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  playBtn: { width: BTN_DIM, height: BTN_DIM, backgroundColor: "#D35098" },
  control: { flex: 1, alignItems: "center" },
  avatarContainer: {
    flex: 1,
    alignItems: "stretch",
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT,
  },
  avatar: {
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT,
  },
  spinner: {},
  closeBtnContainer: {
    flex: 0,
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {},
  audioPlayer: {
    height: 70,
    backgroundColor: Colors.moreOffWhite,
  },
});

