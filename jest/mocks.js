jest.mock("../src/utils/AnalyticsUtils", () => ({ default: jest.fn() }));
jest.mock("../src/services/langService");
jest.mock("../src/services/SharingService");
jest.mock("react-native-svg-uri", () => "SvgUri");

// enable mock when needed
// jest.mock("Dimensions");
