// @flow

/* eslint-disable import/first */

import "react-native";
import React from "react";
import DateView from "../index";

import renderer from "react-test-renderer";

const startDate: string = "2018-05-14";
const endDate: string = "2018-08-31";

test("No props", () => {
  const tree = renderer.create(<DateView />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("Only start date", () => {
  const tree = renderer.create(<DateView startDate={startDate} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("Only end date", () => {
  const tree = renderer.create(<DateView endDate={endDate} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("Correct input", () => {
  const tree = renderer
    .create(<DateView startDate={startDate} endDate={endDate} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("Invalid input", () => {
  const tree = renderer
    .create(
      <DateView startDate={startDate} endDate="this is not a date string" />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
