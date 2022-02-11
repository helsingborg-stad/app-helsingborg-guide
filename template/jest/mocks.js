import mockAsyncStorage from "@react-native-community/async-storage/jest/async-storage-mock";

jest.mock("@utils/AnalyticsUtils", () => ({ default: jest.fn() }));
jest.mock("@utils/DownloadMediaUtils");
jest.mock("@services/langService");
jest.mock("@services/SharingService");
jest.mock("react-native-remote-svg", () => "SVGImg");
jest.mock("@shared-components/AudioPlayerView");
jest.mock("@react-native-community/async-storage", () => mockAsyncStorage);

// enable mock when needed
// jest.mock("Dimensions");
