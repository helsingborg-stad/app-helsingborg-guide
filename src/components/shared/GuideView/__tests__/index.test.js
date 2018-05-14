// @flow

/* eslint-disable import/first */

import "react-native";
import React from "react";
import GuideView from "../index";

import renderer from "react-test-renderer";

const guide: Guide = require("./testdata/guide.json");

test("Render normally", () => {
  let i = 0;
  const now: Date = new Date("July 12, 2018 12:00:00");
  for (i = 0; i < 7; i += 1) {
    const tree = renderer.create(<GuideView
      guide={guide}
      onPressContentObject={() => { }}
    />).toJSON();
    expect(tree).toMatchSnapshot();

    now.setDate(now.getDate() + 1);
  }
});
