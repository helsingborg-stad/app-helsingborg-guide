/**
 * Created by msaeed on 2017-03-08.
 */

/* eslint-disable max-len */
const BLUETOOTH_IMG = require("../images/bluetooth.png");
const DOWNLOAD_IMG = require("../images/download.png");
const MENU_IMG = require("../images/menu.png");

const SLIDE1_IMG = require("../images/skyline1.png");
const SLIDE2_IMG = require("../images/skyline2.png");
const SLIDE3_IMG = require("../images/skyline3.png");

export default {
  en: {
    steps: [
      {
        content: "Enhance your experience of Helsingborg with sound, in-depth information and help getting around.",
        thumbnail: null,
        background: null,
      },
      {
        content:
          "To get the right information at the right place you'll need to activate bluetooth.\n\n Don't worry, it doesn't cost anything and won't use much power.",
        thumbnail: BLUETOOTH_IMG,
        background: SLIDE1_IMG,
      },
      {
        content:
          "In some places you'll need to download the content to view the guide.\n\n The easiest way to do this is through the city's own wifi.",
        thumbnail: DOWNLOAD_IMG,
        background: SLIDE2_IMG,
      },
    ],
  },
  sv: {
    steps: [
      {
        content: "Förstärk din upplevelse av Helsingborg med ljud, fördjupad information och hjälp att hitta. ",
        thumbnail: null,
        background: null,
      },
      {
        content:
          "För att få rätt information  på rätt plats behöver du aktivera bluetooth på telefonen. \n\n Var lugn, det kostar inget och drar inte så mycket batteri.",
        thumbnail: BLUETOOTH_IMG,
        background: SLIDE1_IMG,
      },
      {
        content:
          "På vissa platser behöver du ladda ner innehållet för att ta del av guiden.\n\n Det gör du lättast med stadens wifi.(nätverket Helsingborg)",
        thumbnail: DOWNLOAD_IMG,
        background: SLIDE2_IMG,
      },
    ],
  },
  de: {
    steps: [
      {
        content: "Machen Sie mit Sound, zusätzlicher Information und Hilfesuche noch mehr aus Ihrem Helsingborg-Erlebnis. ",
        thumbnail: null,
        background: null,
      },
      {
        content:
          "Um die richtige Information am richtigen Ort zu bekommen, sollten Sie Bluetooth auf Ihrem Telefon aktivieren. \n\n Keine Sorge, es ist kostenlos und verbraucht nur wenig Batterie.",
        thumbnail: BLUETOOTH_IMG,
        background: SLIDE1_IMG,
      },
      {
        content:
          "An manchen Stellen müssen Sie Inhalte herunterladen, um an der Ausstellung teilzunehmen. \n\n Dies gelingt am einfachsten mit dem Wifi der Stadt (Netzwerk Helsingborg)",
        thumbnail: DOWNLOAD_IMG,
        background: SLIDE2_IMG,
      },
    ],
  },
};
