export default {
  navigation: { isFetching: false, items: [] },
  oldGuideGroups: [],
  guideGroups: [],
  guides: [],
  subLocations: [],
  metrics: [],
  audio: {
    url: "",
    title: "",
    avatar_url: "",
    hasAudio: false,
    isPrepared: false,
    isPlaying: true,
    duration: 0,
    currentPosition: 0,
  },

  internet: { connected: false },
  error: {},
  downloads: [],
  downloadDataVersion: 0,
  position: null,
};
