// @flow

import "react-native";
import { getUrlsFromGuide } from "../UrlUtils";

const guide: Guide = require("./testData01/guide.json");
const expectedUrls: string[] = require("./testData01/expectedUrls.json");

test("Extract URLs from a guide", () => {
  const extractedUrls: string[] = getUrlsFromGuide(guide);
  expect(expectedUrls).toEqual(extractedUrls);
});
