jest.mock("../src/utils/AnalyticsUtils", () => ({ default: jest.fn() }));
jest.mock("../src/services/langService");
jest.mock("react-native-svg-uri", () => "SvgUri");

jest.mock("Dimensions");
