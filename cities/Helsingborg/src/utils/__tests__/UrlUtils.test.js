// @flow
/* eslint-disable global-require */

import "react-native";
import { getUrlsFromGuide } from "../UrlUtils";

test("Extract URLs from a guide with audio and images", () => {
  const guide: Guide = require("./testData01/guide.json");
  const expectedUrls: string[] = require("./testData01/expectedUrls.json");

  const actualUrls: string[] = getUrlsFromGuide(guide);
  expect(expectedUrls).toEqual(actualUrls);
});

test("Extract URLs from a guide with video and images", () => {
  const guide: Guide = require("./testData02/guide.json");
  const expectedUrls: string[] = require("./testData02/expectedUrls.json");

  const actualUrls: string[] = getUrlsFromGuide(guide);
  expect(expectedUrls).toEqual(actualUrls);
});
