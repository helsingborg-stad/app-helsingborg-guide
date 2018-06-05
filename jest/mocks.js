jest.mock("../src/utils/AnalyticsUtils", () => ({ default: jest.fn() }));
jest.mock("../src/utils/DownloadMediaUtils");
jest.mock("../src/services/langService");
jest.mock("../src/services/SharingService");
jest.mock("react-native-remote-svg", () => "SVGImg");
jest.mock("../src/components/shared/AudioPlayerView");

// enable mock when needed
// jest.mock("Dimensions");
