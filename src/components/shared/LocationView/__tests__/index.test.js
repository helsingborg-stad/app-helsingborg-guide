// @flow

/* eslint-disable import/first */

import "react-native";
import React from "react";
import LocationView from "../index";

import renderer from "react-test-renderer";


const geolocation: GeolocationType =
  {
    coords: {
      speed: -1,
      longitude: 12.68871,
      latitude: 56.049228,
      accuracy: 5,
      heading: -1,
      altitude: 0,
      altitudeAccuracy: -1,
    },
    timestamp: 1525253893426.6992,
  };

const guideGroup: GuideGroup =
  {
    active: true,
    description: "Sofiero slottspark är en blomstrande oas",
    id: 222,
    images: {
      large: "https://api.helsingborg.se/wp-content/uploads/sites/2/events/14841adf8354a927c645089c69ca1bf6-1024x575.jpg",
      medium: "https://api.helsingborg.se/wp-content/uploads/sites/2/events/14841adf8354a927c645089c69ca1bf6.jpg",
      thumbnail: "https://api.helsingborg.se/wp-content/uploads/sites/2/events/14841adf8354a927c645089c69ca1bf6-150x150.jpg",
    },
    location: {
      id: 6856,
      latitude: 56.0839149,
      links: [
        {
          service: "webpage",
          url: "https://sofiero.se",
        },
      ],
      longitude: 12.6596795,
      streetAddress: "Sofierovägen 131",
      openingHours: [
        {
          closed: false,
          closing: "18:00",
          dayNumber: 1,
          opening: "10:00",
          weekday: "Monday",
        },
        {
          closed: false,
          closing: "18:00",
          dayNumber: 2,
          opening: "10:00",
          weekday: "Tuesday",
        },
        {
          closed: false,
          closing: "18:00",
          dayNumber: 3,
          opening: "10:00",
          weekday: "Wednesday",
        },
        {
          closed: false,
          closing: "18:00",
          dayNumber: 4,
          opening: "10:00",
          weekday: "Thursday",
        },
        {
          closed: false,
          closing: "18:00",
          dayNumber: 5,
          opening: "10:00",
          weekday: "Friday",
        },
        {
          closed: false,
          closing: "18:00",
          dayNumber: 6,
          opening: "10:00",
          weekday: "Saturday",
        },
        {
          closed: false,
          closing: "18:00",
          dayNumber: 7,
          opening: "10:00",
          weekday: "Sunday",
        },
      ],
      openingHourExceptions: [
        {
          date: "2018-06-22T00:00:00.000Z",
          description: "Midsommarafton. Utställningar är stängda.",
        },
        {
          date: "2018-07-12T00:00:00.000Z",
          description: "Konsert Thåström & First Aid Kit – Entrén stänger 14.00. Besökare måste lämna parken kl 15.00.",
        },
        {
          date: "2018-07-20T00:00:00.000Z",
          description: "Konsert Lars Winnerbäck – Entrén stänger 14.00. Besökare måste lämna parken kl 15.00.",
        },
        {
          date: "2018-07-27T00:00:00.000Z",
          description: "Konsert Queens of Pop – Entrén stänger 13.00. Besökare måste lämna parken kl 14.00.",
        },
        {
          date: "2018-08-23T00:00:00.000Z",
          description: "Dagen före Den stora Trädgårdsfesten. Park och slott är helt stängt.",
        },
        {
          date: "2018-11-01T00:00:00.000Z",
          description: "Ljusstämning. Parken har öppet kl 17-21.",
        },
        {
          date: "2018-11-02T00:00:00.000Z",
          description: "Ljusstämning. Parken har öppet kl 17-21.",
        },
        {
          date: "2018-11-03T00:00:00.000Z",
          description: "Ljusstämning. Parken har öppet kl 17-21.",
        },
        {
          date: "2018-11-04T00:00:00.000Z",
          description: "Ljusstämning. Parken har öppet kl 17-21.",
        },
      ],
    },
    name: "Sofiero",
    slug: "sofiero",
    pointProperties: [
      {
        id: 3806,
        name: "Café",
        slug: "caferestaurang",
        icon: "https://api.helsingborg.se/wp-content/uploads/sites/2/2018/01/icon_cafe.svg",
      },
      {
        id: 3804,
        name: "Gratis wifi",
        slug: "gratis-wifi",
        icon: "https://api.helsingborg.se/wp-content/uploads/sites/2/2018/01/icon_wifi.svg",
      },
      {
        id: 4087,
        name: "Parkering",
        slug: "parkering",
      },
      {
        id: 4085,
        name: "Restaurang",
        slug: "restaurang",
      },
      {
        id: 3607,
        name: "Skötrum",
        slug: "skotrum-2",
        icon: "https://api.helsingborg.se/wp-content/uploads/sites/2/2018/01/icon_baby.svg",
      },
      {
        id: 3606,
        name: "Tillgängligt",
        slug: "rullstolsanpassad-2",
        icon: "https://api.helsingborg.se/wp-content/uploads/sites/2/2018/01/icon_handicapable.svg",
      },
      {
        id: 3800,
        name: "Toalett",
        slug: "toalett",
        icon: "https://api.helsingborg.se/wp-content/uploads/sites/2/2018/01/icon_toilet.svg",
      },
    ],
  };

test("weekdays", () => {
  let i = 0;
  const now: Date = new Date("July 12, 2018 12:00:00");
  for (i = 0; i < 7; i += 1) {
    const tree = renderer.create(<LocationView guideGroup={guideGroup} now={now} navigation={{}} />).toJSON();
    expect(tree).toMatchSnapshot();

    now.setDate(now.getDate() + 1);
  }
});


test("with geolocation", () => {
  const now: Date = new Date("June 12, 2017 12:00:00");
  const tree = renderer.create(<LocationView
    guideGroup={guideGroup}
    now={now}
    navigation={{}}
    geolocation={geolocation}
  />).toJSON();
  expect(tree).toMatchSnapshot();
});


// with point properties
test("with point properties", () => {
  const now: Date = new Date("June 12, 2017 12:00:00");
  const tree = renderer.create(<LocationView
    guideGroup={guideGroup}
    now={now}
    navigation={{}}
  />).toJSON();
  expect(tree).toMatchSnapshot();
});
