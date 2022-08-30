// @flow
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DownloadItemView from "@shared-components/DownloadItemView";
import { Colors } from "@assets/styles";
import {
  cancelDownloadGuide,
  pauseDownloadGuide,
  resumeDownloadGuide,
} from "@actions/downloadGuidesActions";
import { selectCurrentGuide, showBottomBar } from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.white,
  },
});

type Props = {
  downloads: OfflineGuide[],
  cancelDownload(guide: Guide): void,
  hideBottomBar(): void,
  pauseDownload(guide: Guide): void,
  resumeDownload(guide: Guide): void,
  selectGuide(guide: Guide): void,
  navigation: any,
  item: Object,
};

const DownloadsScreen = (props: Props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const { offlineGuides } = useSelector((s) => s.downloadedGuides);
  const downloads = Object.values(offlineGuides);

  const navigateToGuide = (offlineGuide: OfflineGuide): void => {
    const { guide } = offlineGuide;
    const { guideType } = guide;
    dispatch(selectCurrentGuide(guide));

    if (guideType === "guide") {
      dispatch(showBottomBar(false));
      const slug = guide?.slug;
      const title = guide?.name;
      trackScreen("view_guide", slug || title);
      navigation.navigate("GuideDetailsScreen", {
        title: title,
        bottomBarOnUnmount: true,
        disableShare: true,
      });
    } else if (guideType === "trail") {
      dispatch(showBottomBar(false));
      const slug = guide?.slug;
      const title = guide?.name;
      trackScreen("view_guide", slug || title);
      navigation.navigate("TrailScreen", {
        title: title,
        bottomBarOnUnmount: true,
        disableShare: true,
      });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <DownloadItemView
        title={item.guide.name}
        thumbnail={item.guide.images.thumbnail}
        progress={item.progress}
        isPaused={item.status === "paused"}
        onPausePress={() => dispatch(pauseDownloadGuide(item.guide))}
        onResumePress={() => dispatch(resumeDownloadGuide(item.guide))}
        onClearPress={() => dispatch(cancelDownloadGuide(item.guide))}
        onPressItem={() => navigateToGuide(item)}
      />
    );
  };

  return (
    <FlatList
      style={styles.mainContainer}
      keyExtractor={(item) => `${item.guide.id}`}
      data={downloads}
      renderItem={renderItem}
    />
  );
};
export default DownloadsScreen;
