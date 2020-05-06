import { ImageSourcePropType } from "react-native";
const robotImage = require("@assets/images/quiz/dunkers/robot.png");
const exhibitionRobotImage = require("@assets/images/quiz/dunkers/exhibition_robot.png");
const elseMarieImage = require("@assets/images/quiz/dunkers/else_marie.png");
const elseMarieFigurenImage = require("@assets/images/quiz/dunkers/else_marie_figuren.png");
const lillZlatanImage = require("@assets/images/quiz/dunkers/lill_zlatan.png");
const barnetImage = require("@assets/images/quiz/dunkers/barnet.png");

type QuizBotMessage = {
  type: "bot",
  id: string,
  text: string
};

type QuizBotImageMessage = {
  type: "botimage",
  id: string,
  source: ImageSourcePropType,
  aspectRatio: number
};

type QuizUserMessage = {
  type: "bot",
  id: string,
  text: string
};

type QuizPrompt = {
  type: "prompt",
  id: string,
  alternatives: QuizPromptAlternative[]
};

export type QuizPromptAlternative = {
  text: string,
  followups?: { text: string }[]
};

export type QuizItem =
  | QuizBotMessage
  | QuizBotImageMessage
  | QuizUserMessage
  | QuizPrompt;

export const dunkersSwedishQuizItems: QuizItem[] = [
  { id: "intro-0", type: "botimage", source: robotImage, aspectRatio: 1 },
  { id: "intro-1", type: "bot", text: "Hej!" },
  { id: "intro-2", type: "bot", text: "Hallå!" },

  { id: "intro-3", type: "bot", text: "Är du där? Kan du se mig?" },
  {
    id: "intro-4",
    type: "bot",
    text: "Oj, jag menar…\nVälkommen hit, jag är här för att hjälpa dig!"
  },
  {
    id: "intro-5",
    type: "bot",
    text: "Har du fyllt i de Väldigt Viktiga Uppgifterna i Kollprotokollet?"
  },
  {
    id: "intro-6",
    type: "prompt",
    alternatives: [{ text: "Det har jag gjort" }]
  },
  { id: "intro-7", type: "bot", text: "Vet du… jag har inget namn… 😭" },
  {
    id: "intro-8",
    type: "bot",
    text:
      "Men du! Du som har ett så bra namn – kan inte du hitta på ett till mig?"
  },
  {
    id: "intro-9",
    type: "prompt",
    alternatives: [{ text: "Okej, det kan jag göra." }]
  },
  { id: "intro-10", type: "bot", text: "Ja! 😮🤩🤩" },
  {
    id: "intro-11",
    type: "bot",
    text:
      "Du kanske kan skriva ner namnet i Kollprotokollet. Så att vi inte glömmer. Jag väntar här."
  },
  { id: "intro-12", type: "prompt", alternatives: [{ text: "Fixat!" }] },
  { id: "intro-13", type: "bot", text: "😭😍 Vilket fantastiskt namn. Tack!" },
  {
    id: "intro-14",
    type: "bot",
    text: "Jag frågade om du kunde se mig förut."
  },
  {
    id: "intro-15",
    type: "bot",
    text: "Det går ju inte riktigt. Jag finns ju bara i appen."
  },
  {
    id: "intro-16",
    type: "bot",
    text:
      "Men! Vi kan hitta på att du kan se mig och att vi är jättebra vänner. 😀"
  },
  {
    id: "intro-17",
    type: "prompt",
    alternatives: [
      {
        text: "Ja det kan jag väl!",
        followups: [
          { text: "Hurra! 🥳 En ny vän! Även om vi bara låtsas!" },
          { text: "🥳🥳🥳" }
        ]
      },
      {
        text: "Fast vi känner ju inte varandra?",
        followups: [
          {
            text:
              "Nä, det har du rätt i. Men jag tänkte vi kunde låtsas? Då behöver det ju inte vara sant. 😊"
          }
        ]
      }
    ]
  },
  {
    id: "intro-18",
    type: "bot",
    text:
      "Nu när vi låtsas att vi är vänner, då är det ju som att det är sant… eller?"
  },
  {
    id: "intro-19",
    type: "bot",
    text: "Åh det är svårt det där tycker jag. Vad som är sant."
  },
  {
    id: "intro-20",
    type: "bot",
    text: "🤔"
  },
  {
    id: "intro-21",
    type: "bot",
    text: "Vem bestämmer vad som är sant egentligen? Vad tycker du?"
  },
  {
    id: "intro-22",
    type: "prompt",
    alternatives: [{ text: "Vi har diskuterat färdigt!" }]
  },
  {
    id: "intro-23",
    type: "bot",
    text: "Förlåt, du kanske vill veta varför jag är här?"
  },
  {
    id: "intro-24",
    type: "bot",
    text: "Jag är utställningens robot."
  },
  {
    id: "intro-25",
    type: "botimage",
    source: exhibitionRobotImage,
    aspectRatio: 1
  },
  {
    id: "intro-26",
    type: "bot",
    text: "Alla utställningar har väl robotar?"
  },
  {
    id: "intro-27",
    type: "prompt",
    alternatives: [
      {
        text: "Nej, det tror jag inte? 🤔",
        followups: [
          { text: "Hmm... Ja, då är det bara jag kanske?" },
          { text: "Så spännande! 😀" }
        ]
      },
      {
        text: "Inte alla, men några kanske?",
        followups: [
          { text: "Några robotar! Coolt!" },
          { text: "Undra om jag kan träffa dem?" }
        ]
      },
      {
        text: "Ja! Såklart de har!",
        followups: [
          { text: "Åh vad kul! 😄" },
          { text: "Jag får leta reda på någon annan robot någon dag!" }
        ]
      }
    ]
  },
  {
    id: "intro-28",
    type: "bot",
    text: "Nåja. Hur som helst."
  },
  {
    id: "intro-29",
    type: "bot",
    text: "Jag är här för att visa dig utställningen! 🤗"
  },
  {
    id: "intro-30",
    type: "bot",
    text: "Och sen har jag några uppdrag till dig."
  },
  {
    id: "intro-31",
    type: "bot",
    text:
      "Och du verkar vara väldigt snäll. Så jag kanske ber dig om hjälp med några andra grejer också. 😬"
  },
  {
    id: "intro-32",
    type: "bot",
    text: "Ser du ansiktet på Else-Marie?"
  },
  {
    id: "intro-33",
    type: "bot",
    text: "Vi startar där borta!"
  },
  {
    id: "intro-34",
    type: "botimage",
    source: elseMarieImage,
    aspectRatio: 1.4679
  },
  {
    id: "intro-35",
    type: "prompt",
    alternatives: [{ text: "Jag har hittat hit!" }]
  },
  {
    id: "elsemarie-0",
    type: "bot",
    text: "Titta! :D"
  },
  {
    id: "elsemarie-1",
    type: "bot",
    text: "Det är som en jättestor bok! 📖"
  },
  {
    id: "elsemarie-2",
    type: "bot",
    text: "Tycker du om att läsa böcker?"
  },
  {
    id: "elsemarie-3",
    type: "prompt",
    alternatives: [
      {
        text: "Ja, oftast!",
        followups: [
          { text: "Intressant!" },
          { text: "Tror jag…" },
          { text: "Jag har aldrig läst någon bok." }
        ]
      },
      {
        text: "Nej, kanske ibland.",
        followups: [
          { text: "Vet du, jag har faktiskt aldrig läst någon bok." },
          { text: "Vi skulle kunna läsa tillsammans någon dag! 😊" }
        ]
      }
    ]
  },
  {
    id: "elsemarie-4",
    type: "bot",
    text: "Men du! Har du någonsin sett så många fötter?"
  },
  {
    id: "elsemarie-5",
    type: "bot",
    text: "Det är typ tusen fötter här!"
  },
  {
    id: "elsemarie-6",
    type: "bot",
    text: "🦶🦶🦶🦶🦶🦶🦶🦶🦶🦶🦶🦶🦶🦶🦶🦶"
  },
  {
    id: "elsemarie-7",
    type: "bot",
    text: "Eller… Kanske inte tusen."
  },
  {
    id: "elsemarie-8",
    type: "bot",
    text: "Jag är inte så bra på att räkna."
  },
  {
    id: "elsemarie-9",
    type: "bot",
    text: "Hur många fötter hittar du?"
  },
  //TODO how to handle incorrect answers?
  {
    id: "elsemarie-10",
    type: "prompt",
    alternatives: [
      {
        text: "12",
        followups: [{ text: "Hmm...stämmer det verkligen?🤔" }]
      },
      {
        text: "16",
        followups: [{ text: "Perfekt! Tack!" }]
      },
      {
        text: "1000",
        followups: [{ text: "Är du säker? Räkna igen!" }]
      }
    ]
  },
  {
    id: "elsemarie-11",
    type: "bot",
    text: "Okej, sexton fötter alltså. Bra att veta!"
  },
  {
    id: "elsemarie-12",
    type: "bot",
    text: "Else-Marie, hon med spelet, hon har sju pappor!"
  },
  // TODO number of emojis?
  {
    id: "elsemarie-13",
    type: "bot",
    text: "Det är deras fötter du ser under🦶📄📄🦶🦶🦶🦶🦶🦶🦶🦶🦶"
  },
  {
    id: "elsemarie-14",
    type: "bot",
    text: "Tänk att ha sju pappor."
  },
  {
    id: "elsemarie-15",
    type: "bot",
    text: "Hur tror du det skulle vara att ha sju pappor?"
  },
  {
    id: "elsemarie-16",
    type: "prompt",
    alternatives: [
      {
        text: "Vi har funderat!"
      }
    ]
  },
  {
    id: "elsemarie-17",
    type: "bot",
    text: "Spännande!"
  },
  {
    id: "elsemarie-18",
    type: "bot",
    text: "Vet du, här finns fler böcker! 📖 📖📖"
  },
  {
    id: "elsemarie-19",
    type: "bot",
    text: "Kan du gå dit där du ser den här figuren?"
  },
  {
    id: "elsemarie-20",
    type: "botimage",
    source: elseMarieFigurenImage,
    aspectRatio: 1.4679
  },
  {
    id: "elsemarie-21",
    type: "prompt",
    alternatives: [
      {
        text: "Jag är framme!"
      }
    ]
  },
  {
    id: "siv-0",
    type: "bot",
    text: "Oj här ligger visst Cerisia och sover! 😴"
  },
  {
    id: "siv-1",
    type: "bot",
    text:
      "Men Siv är vaken. Hon sover över hos Cerisia. För första gången någonsin! 😮"
  },
  {
    id: "siv-2",
    type: "bot",
    text: "Siv verkar inte riktigt glad? Vad tycker du?"
  },
  {
    id: "siv-3",
    type: "prompt",
    alternatives: [
      {
        text: "Hon ser lite ledsen ut",
        followups: [
          {
            text: "Hon kan kanske inte somna. Om hon hälsar på hos en kompis."
          },
          { text: "Det kan vara läskigt att sova på en ny plats." }
        ]
      },
      {
        text: "Jag tycker inte hon verkar ledsen",
        followups: [
          { text: "Åh vad bra! ☺" },
          { text: "Hon kanske bara har svårt att somna på en ny plats." }
        ]
      }
    ]
  },
  {
    id: "siv-4",
    type: "bot",
    text: "Det är inte så lätt alltid. Att sova på ett nytt ställe."
  },
  {
    id: "siv-5",
    type: "bot",
    text: "Allt är annorlunda. Och luktar fel."
  },
  {
    id: "siv-6",
    type: "bot",
    text: "Då kan det vara svårt att sova."
  },
  {
    id: "siv-7",
    type: "bot",
    text: "Har du svårt att somna ibland?"
  },
  {
    id: "siv-8",
    type: "prompt",
    alternatives: [
      {
        text: "Ja, det har jag.",
        followups: [
          { text: "Det låter lite jobbigt. Tror jag." },
          { text: "Jag sover inte alls. Det gör inte robotar!" }
        ]
      },
      {
        text: "Nej, nästan aldrig.",
        followups: [
          { text: "Vet du, jag sover aldrig." },
          { text: "Robotar sover inte. Inte jag i alla fall." }
        ]
      }
    ]
  },
  {
    id: "siv-9",
    type: "bot",
    text: "Men du kanske kan hjälpa Siv!"
  },
  {
    id: "siv-10",
    type: "bot",
    text:
      "Om du tar fram Kollprotokollet och skriver ner ditt bästa tips för att somna."
  },
  {
    id: "siv-11",
    type: "bot",
    text: "Så kan jag ge det till Siv sen. 😄"
  },
  {
    id: "siv-12",
    type: "prompt",
    alternatives: [
      {
        text: "Jag har skrivt ner ett tips!"
      }
    ]
  },
  {
    id: "siv-13",
    type: "bot",
    text: "…"
  },
  {
    id: "siv-14",
    type: "bot",
    text: "Har du tänkt på en sak?"
  },
  {
    id: "siv-15",
    type: "bot",
    text:
      "När man sover drömmer man ibland. Vuxna brukar säga att drömmar inte är på riktigt."
  },
  {
    id: "siv-16",
    type: "bot",
    text: "Hur vet man att drömmar inte är på riktigt?"
  },
  {
    id: "siv-17",
    type: "prompt",
    alternatives: [
      {
        text: "När man vaknar är man kvar i sängen."
      },
      {
        text: "Det händer konstiga saker som inte kan hända."
      },
      {
        text: "Det kanske visst är på riktigt?"
      }
    ]
  },
  {
    id: "siv-18",
    type: "bot",
    text: "Hmm, ja du har ju rätt."
  },
  {
    id: "siv-19",
    type: "bot",
    text: "Det är ju på riktigt att jag sover och att jag drömmer."
  },
  {
    id: "siv-20",
    type: "bot",
    text:
      "Men jag har varken varit undervattenspirat, eller hoppat höjdhopp på månen."
  },
  {
    id: "siv-21",
    type: "bot",
    text: "Vissa drömmar är jättekonstiga."
  },
  {
    id: "siv-22",
    type: "bot",
    text:
      "Som när jag drömde att jag hjälpte mini-elefanter simma över havet. Jag hjälpte dem att hålla upp snablarna över vattnet. Sen solade vi på stranden. ☀️🥰🥰"
  },
  {
    id: "siv-23",
    type: "bot",
    text: "Har du drömt något roligt eller spännande någongång?"
  },
  {
    id: "siv-24",
    type: "prompt",
    alternatives: [
      {
        text: "Vi har berättat för varandra!"
      }
    ]
  },
  {
    id: "siv-25",
    type: "bot",
    text:
      "Fast… om jag drömt en mardröm så är jag glad att drömmar inte är på riktigt.😰"
  },
  {
    id: "siv-26",
    type: "bot",
    text: "Hoppas Siv kan somna snart. 😴"
  },
  {
    id: "lillzlatan-0",
    type: "bot",
    text: "Ser du bilderna på väggen? 🧐️"
  },
  {
    id: "lillzlatan-1",
    type: "bot",
    text: "Kan du hitta den här figuren?"
  },
  {
    id: "lillzlatan-2",
    type: "botimage",
    source: lillZlatanImage,
    aspectRatio: 1.4679
  },
  {
    id: "lillzlatan-3",
    type: "prompt",
    alternatives: [
      {
        text: "Hittat!"
      }
    ]
  },
  {
    id: "lillzlatan-4",
    type: "bot",
    text: "Hon heter Ella."
  },
  {
    id: "lillzlatan-5",
    type: "bot",
    text: "Fast hon kallas Lill-Zlatan"
  },
  {
    id: "lillzlatan-6",
    type: "bot",
    text: "Hon gillar att spela fotboll. ⚽⚽⚽⚽"
  },
  {
    id: "lillzlatan-7",
    type: "bot",
    text: "Men vad har hänt innan den här bilden egentligen?"
  },
  {
    id: "lillzlatan-8",
    type: "bot",
    text:
      "Berätta för varandra varför ni tror att Ella ser lite arg ut och det ligger toapapper i handfatet"
  },
  {
    id: "lillzlatan-9",
    type: "prompt",
    alternatives: [
      {
        text: "Vi har berättat!"
      }
    ]
  },
  {
    id: "lillzlatan-10",
    type: "bot",
    text:
      "Jag tror att Ella precis räddat världen eftersom det bodde tusen pyttesmå giftiga flugor i toapappret."
  },
  {
    id: "lillzlatan-11",
    type: "bot",
    text: "Men när de hamnade i vattnet blev de snälla och ogiftiga. 😍"
  },
  {
    id: "lillzlatan-12",
    type: "bot",
    text: "Trodde ni också det?"
  },
  {
    id: "lillzlatan-13",
    type: "prompt",
    alternatives: [
      {
        text: "Nej!",
        followups: [
          { text: "Nä, ofta tror man inte samma." },
          { text: "Vi tittar på samma bild och ändå ser vi helt olika saker." }
        ]
      },
      {
        text: "Ja, precis samma!",
        followups: [
          { text: "Oj! Tänk att vi tänker likadant." },
          {
            text:
              "Ibland tittar man på samma bild men man ser helt olika saker! 😮"
          }
        ]
      }
    ]
  },
  {
    id: "lillzlatan-14",
    type: "bot",
    text: "Vet du."
  },
  {
    id: "lillzlatan-15",
    type: "bot",
    text: "Varje dag måste jag kolla vilken ordning bilderna på väggen är i. 😵"
  },
  {
    id: "lillzlatan-16",
    type: "bot",
    text: "Så att vi kan kolla om det är rätt."
  },
  {
    id: "lillzlatan-17",
    type: "bot",
    text: "Kan du titta på nummer 3 i Kollprotkollet."
  },
  {
    id: "lillzlatan-18",
    type: "bot",
    text:
      "Kan du kolla vilken ordning de är i på väggen och sedan skriva ett nummer vid varje?"
  },
  {
    id: "lillzlatan-19",
    type: "prompt",
    alternatives: [
      {
        text: "Jag är färdig!"
      }
    ]
  },
  {
    id: "lillzlatan-20",
    type: "bot",
    text: "👍"
  },
  {
    id: "lillzlatan-21",
    type: "bot",
    text: "Vi kan använda allt du skriver ner i protokollet sen."
  },
  {
    id: "lillzlatan-22",
    type: "bot",
    text: "När utställningen ska kollas av."
  },
  {
    id: "lillzlatan-23",
    type: "bot",
    text: "Fast jag vet inte riktigt vem som gör det…"
  },
  {
    id: "lillzlatan-24",
    type: "bot",
    text: "Varför måste de veta så mycket? 🤔"
  },
  {
    id: "lillzlatan-25",
    type: "bot",
    text: "Jaja, det spelar ingen roll nu!"
  },
  {
    id: "lillzlatan-26",
    type: "bot",
    text: "Kan du hitta barnet som ser ut såhär?"
  },
  {
    id: "lillzlatan-27",
    type: "botimage",
    source: barnetImage,
    aspectRatio: 1.4679
  },
  {
    id: "lillzlatan-28",
    type: "prompt",
    alternatives: [
      {
        text: "Här är hen!"
      }
    ]
  }
];
