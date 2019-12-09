// @flow

/* eslint-disable import/first */
import "react-native";
import React from "react";
import { DownloadButton } from "../index";

import renderer from "react-test-renderer";

test("status => stopped", () => {
  const status: DownloadStatus = "stopped";
  const progress = 0;
  const tree = renderer
    .create(
      <DownloadButton
        status={status}
        progress={progress}
        startDownload={() => {}}
        resumeDownload={() => {}}
        cancelDownload={() => {}}
        pauseDownload={() => {}}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("status => stopped, progress >= 1", () => {
  const status: DownloadStatus = "stopped";
  const progress = 2;
  const tree = renderer
    .create(
      <DownloadButton
        status={status}
        progress={progress}
        startDownload={() => {}}
        resumeDownload={() => {}}
        cancelDownload={() => {}}
        pauseDownload={() => {}}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("status => pending, progress < 1", () => {
  const status: DownloadStatus = "pending";
  const progress = 0;
  const tree = renderer
    .create(
      <DownloadButton
        status={status}
        progress={progress}
        startDownload={() => {}}
        resumeDownload={() => {}}
        cancelDownload={() => {}}
        pauseDownload={() => {}}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("status => pending, progress >= 1", () => {
  const status: DownloadStatus = "pending";
  const progress = 2;
  const tree = renderer
    .create(
      <DownloadButton
        status={status}
        progress={progress}
        startDownload={() => {}}
        resumeDownload={() => {}}
        cancelDownload={() => {}}
        pauseDownload={() => {}}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("status => paused, progress < 1", () => {
  const progress = 0;
  const tree = renderer
    .create(
      <DownloadButton
        status="paused"
        progress={progress}
        startDownload={() => {}}
        resumeDownload={() => {}}
        cancelDownload={() => {}}
        pauseDownload={() => {}}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("status => paused, progress >= 1", () => {
  const progress = 2;
  const tree = renderer
    .create(
      <DownloadButton
        status="paused"
        progress={progress}
        startDownload={() => {}}
        resumeDownload={() => {}}
        cancelDownload={() => {}}
        pauseDownload={() => {}}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("status => done, progress < 1", () => {
  const progress = 0;
  const tree = renderer
    .create(
      <DownloadButton
        status="done"
        progress={progress}
        startDownload={() => {}}
        resumeDownload={() => {}}
        cancelDownload={() => {}}
        pauseDownload={() => {}}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test("status => done, progress >= 1", () => {
  const progress = 2;
  const tree = renderer
    .create(
      <DownloadButton
        status="done"
        progress={progress}
        startDownload={() => {}}
        resumeDownload={() => {}}
        cancelDownload={() => {}}
        pauseDownload={() => {}}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
