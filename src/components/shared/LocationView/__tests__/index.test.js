// @flow

/* eslint-disable import/first */

import "react-native";
import React from "react";
import LocationView from "../index";

import renderer from "react-test-renderer";

jest.mock("../../../../utils/AnalyticsUtils", () => ({ default: jest.fn() }));

jest.mock("../../../../services/langService");

const guideGroup: GuideGroup =
  {
    id: 222,
    description: "Sofiero slottspark är en blomstrande oas och visar varje vår och sommar upp 10 000 blommande rhododendronbuskar i en kaskad av olika färger och sorter. Parken och slottet har tidigare varit ett kungligt sommarresidens. Oscar II lät uppföra Sofiero och tillägnade slottet till sin kära Sofia. Parken skänktes av Gustaf VI Adolf till Helsingborgs stad 1959 och har sedan 1974 stått öppen för allmänheten. Mitt bland rhododendronblommorna kan du besöka ravinens porlande bäck, konstutställningar och slottsrestaurangen med utsikt över Öresund som finns med i White Guide för sin gourmetmat. Eller ta med egen filt och picknickkorg och njut i slottsparken.",
    name: "Sofiero",
    slug: "sofiero",
    images: {
      thumbnail: "https://api.helsingborg.se/wp-content/uploads/sites/2/events/14841adf8354a927c645089c69ca1bf6-150x150.jpg",
      medium: "https://api.helsingborg.se/wp-content/uploads/sites/2/events/14841adf8354a927c645089c69ca1bf6.jpg",
      large: "https://api.helsingborg.se/wp-content/uploads/sites/2/events/14841adf8354a927c645089c69ca1bf6-768x432.jpg",
    },
    active: true,
    location: {
      id: 6856,
      streetAddress: "Sofierovägen 131",
      latitude: 56.0839149,
      longitude: 12.6596795,
      links: [
        {
          service: "webpage",
          url: "https://sofiero.se",
        },
      ],
      openHours: [
        {
          weekday: "Monday",
          closed: false,
          opening: "10:00",
          closing: "11:00",
          dayNumber: 1,
        },
        {
          weekday: "Tuesday",
          closed: false,
          opening: "10:00",
          closing: "12:00",
          dayNumber: 2,
        },
        {
          weekday: "Wednesday",
          closed: false,
          opening: "10:00",
          closing: "13:00",
          dayNumber: 3,
        },
        {
          weekday: "Thursday",
          closed: false,
          opening: "9:00",
          closing: "14:00",
          dayNumber: 4,
        },
        {
          weekday: "Friday",
          closed: false,
          opening: "10:00",
          closing: "15:00",
          dayNumber: 5,
        },
        {
          weekday: "Saturday",
          closed: true,
          opening: "10:00",
          closing: "16:00",
          dayNumber: 6,
        },
        {
          weekday: "Sunday",
          closed: true,
          opening: "10:00",
          closing: "17:00",
          dayNumber: 7,
        },
      ],
      openHoursException: [
        {
          exception_date: "2017-06-13",
          exeption_information: "Parken stänger kl 15 med sista insläpp kl 14.",
        },
        {
          exception_date: "2017-06-18",
          exeption_information: "Sofiero Classic. Parken har öppet kl 10-16.",
        },
        {
          exception_date: "2017-06-23",
          exeption_information: "Midsommarafton. Parken har öppet kl 12-16.",
        },
        {
          exception_date: "2017-07-06",
          exeption_information: "Parken stänger kl 15 med sista insläpp kl 14.",
        },
        {
          exception_date: "2017-07-16",
          exeption_information: "Parken stänger kl 15 med sista insläpp kl 14.",
        },
        {
          exception_date: "2017-08-02",
          exeption_information: "Parken stänger kl 15 med sista insläpp kl 14.",
        },
        {
          exception_date: "2017-08-03",
          exeption_information: "Parken stänger kl 15 med sista insläpp kl 14.",
        },
        {
          exception_date: "2017-08-24",
          exeption_information: "Dagen före Den stora Trädgårdsfesten. Helt stängt.",
        },
      ],
    },

  };


test("no geolocation", () => {
  const now: Date = new Date("June 11, 2018 12:00:00");
  const tree = renderer.create(<LocationView guideGroup={guideGroup} now={now} navigation={{}} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test("weekdays", () => {
  let i = 0;
  const now: Date = new Date("June 11, 2018 12:00:00");
  for (i = 0; i < 7; i += 1) {
    const tree = renderer.create(<LocationView guideGroup={guideGroup} now={now} navigation={{}} />).toJSON();
    expect(tree).toMatchSnapshot();

    now.setDate(now.getDate() + 1);
  }
});
