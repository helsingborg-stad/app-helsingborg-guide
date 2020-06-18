/**
 * Created by msaeed on 2017-03-08.
 */

/* eslint-disable max-len */
const BLUETOOTH_IMG = require("../images/bluetooth.png");
const DOWNLOAD_IMG = require("../images/download.png");
// const MENU_IMG = require("../images/menu.png");

const SLIDE1_IMG = require("../images/skyline1.png");
const SLIDE2_IMG = require("../images/skyline2.png");
// const SLIDE3_IMG = require("../images/skyline3.png");

export default {
  en: {
    steps: [
      {
        content:
          "Enhance your experience of Lund with sound, in-depth information and help getting around.",
        thumbnail: null,
        background: null,
      },
      {
        content:
          "In some places you'll need to download the content to view the guide.\n\nThe easiest way to do this is through the city's own wifi.\n(The network Lund_Public)",
        thumbnail: DOWNLOAD_IMG,
        background: SLIDE2_IMG,
      },
    ],
  },
  sv: {
    steps: [
      {
        content:
          "Förstärk din upplevelse av Lund med ljud, fördjupad information och hjälp att hitta. ",
        thumbnail: null,
        background: null,
      },
      {
        content:
          "På vissa platser behöver du ladda ner innehållet för att ta del av guiden.\n\nDet gör du lättast med stadens wifi.\n(nätverket Lund_Public)",
        thumbnail: DOWNLOAD_IMG,
        background: SLIDE2_IMG,
      },
    ],
  },
  de: {
    steps: [
      {
        content:
          "Machen Sie mit Sound, zusätzlicher Information und Hilfesuche noch mehr aus Ihrem Lund-Erlebnis. ",
        thumbnail: null,
        background: null,
      },
      {
        content:
          "An manchen Stellen müssen Sie Inhalte herunterladen, um an der Ausstellung teilzunehmen.\n\nDies gelingt am einfachsten mit dem Wifi der Stadt.\n(Netzwerk Lund_Public)",
        thumbnail: DOWNLOAD_IMG,
        background: SLIDE2_IMG,
      },
    ],
  },
};
