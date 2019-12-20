import { StyleSheet } from "react-native";
import { Colors } from "@assets/styles";

const PLAYER_HEIGHT = 70;
const BTN_DIM = 36;

export default StyleSheet.create({
  playerContainer: {
    height: PLAYER_HEIGHT,
    backgroundColor: Colors.offWhite4,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopWidth: 2,
    borderColor: Colors.listBackgroundColor
  },
  sliderAndTitleContainer: {
    flex: 3,
    backgroundColor: Colors.offWhite4,
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingVertical: 10
  },
  sliderContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6
  },
  titleContainer: { flex: 1, alignItems: "center", paddingHorizontal: 15 },
  titleText: { fontSize: 12, lineHeight: 14, fontWeight: "bold" },
  disabledText: { color: Colors.gray8 },
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
    left: 0
  },
  playBtn: {
    width: BTN_DIM,
    height: BTN_DIM,
    backgroundColor: Colors.themeControl
  },
  control: { flex: 1, alignItems: "center" },
  avatarContainer: {
    flex: 1,
    alignItems: "stretch",
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT
  },
  avatar: {
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT
  },
  loadingSpinner: {
    height: "100%",
    width: "100%"
  },
  closeBtnContainer: {
    flex: 0,
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center"
  },
  closeBtn: {},
  audioPlayer: {
    flex: 0.12,
    backgroundColor: Colors.offWhite4
  }
});
