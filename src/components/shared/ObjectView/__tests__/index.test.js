// @flow

/* eslint-disable import/first */

import "react-native";
import React from "react";
import ObjectView from "../index";

import renderer from "react-test-renderer";

const currentContentObject: ContentObject = {
  id: "59521803842fa",
  images: [
    {
      large: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/1920x1080-01_bottenv%C3%A5ning-1024x576.jpg",
      medium: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/1920x1080-01_bottenv%C3%A5ning-300x169.jpg",
      thumbnail: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/1920x1080-01_bottenv%C3%A5ning-150x150.jpg",
    },
    {
      large: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/1920x1080-02_bottenv%C3%A5ning-1024x576.jpg",
      medium: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/1920x1080-02_bottenv%C3%A5ning-300x169.jpg",
      thumbnail: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/1920x1080-02_bottenv%C3%A5ning-150x150.jpg",
    },
    {
      large: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/1920x1080-03_bottenv%C3%A5ning-1024x576.jpg",
      medium: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/1920x1080-03_bottenv%C3%A5ning-300x169.jpg",
      thumbnail: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/1920x1080-03_bottenv%C3%A5ning-150x150.jpg",
    },
  ],
  order: 1,
  postStatus: "publish",
  searchableId: "001",
  title: "Vaktvåningen",
  description: "Välkommen in! Trappan upp till vaktvåningen säger något om svårigheten att inta borgen.",
  links: [
    {
      title: "test",
      url: "http://www.google.com/",
    },
  ],
  audio: {
    contentType: "audio",
    created: "2017-11-03T13:47:20.000Z",
    description: "\"vakt-svensk\" från 1001 av Kärnan. Släppt: 2014. Spår 1. Genre: Svensk.",
    id: 71197,
    modified: "2017-11-03T13:47:36.000Z",
    title: "Vaktvåningen_svenska",
    url: "https://api.helsingborg.se/wp-content/uploads/sites/2/2017/06/vakt-svensk.mp3",
  },
  beacon: {
    distance: 10,
    id: "",
    nid: "f7826da6bc5b71e0893e",
    position: {
      latitude: 56.0483045,
      longitude: 12.6974978,
    },
  },
};

function onSwiperIndexChanged() {
}
function onGoToImage() {
}
function onGoToLink() {
}
function loadAudioFile() {
}
function onGoToVideo() {
}
function onClosePlayer() {
}
function onTogglePlaying() {
}
function onSliding() {
}
function onSliderValueCompleted() {
}

test("Basic GuideObject", () => {
  const tree = renderer.create(<ObjectView
    contentObject={currentContentObject}
    guideType="guide"
    onSwiperIndexChanged={onSwiperIndexChanged}
    audioButtonDisabled
    videoButtonDisabled
    imageIndex={0}
    onGoToImage={onGoToImage}
    onGoToLink={onGoToLink}
    loadAudioFile={loadAudioFile}
    onGoToVideo={onGoToVideo}
    onClosePlayer={onClosePlayer}
    onTogglePlaying={onTogglePlaying}
    onSliding={onSliding}
    onSliderValueCompleted={onSliderValueCompleted}
  />).toJSON();
  expect(tree).toMatchSnapshot();
});
