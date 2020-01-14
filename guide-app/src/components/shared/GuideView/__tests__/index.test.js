// @flow

/* eslint-disable import/first */

import "react-native";
import React from "react";
import GuideView from "../index";

import renderer from "react-test-renderer";

jest.mock("../../DownloadButton", () => "DownloadButton");
jest.mock("../../ImageView", () => "ImageView");

const guideWithoutTagline: Guide = require("./testdata/guide_no_tagline.json");
const guideWithTagline: Guide = require("./testdata/guide_tagline.json");

test("Guide without tagline", () => {
  let i = 0;
  const now: Date = new Date("July 12, 2018 12:00:00");
  for (i = 0; i < 7; i += 1) {
    const tree = renderer
      .create(
        <GuideView
          guide={guideWithoutTagline}
          onPressContentObject={() => {}}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();

    now.setDate(now.getDate() + 1);
  }
});

test("Guide with tagline", () => {
  let i = 0;
  const now: Date = new Date("July 12, 2018 12:00:00");
  for (i = 0; i < 7; i += 1) {
    const tree = renderer
      .create(
        <GuideView guide={guideWithTagline} onPressContentObject={() => {}} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();

    now.setDate(now.getDate() + 1);
  }
});
