import { ImageSourcePropType } from "react-native";
const robotImage = require("@assets/images/quiz/dunkers/robot.png");
const exhibitionRobotImage = require("@assets/images/quiz/dunkers/exhibition_robot.png");
const elseMarieImage = require("@assets/images/quiz/dunkers/else_marie.png");
const elseMarieFigurenImage = require("@assets/images/quiz/dunkers/else_marie_figuren.png");

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
  }
];
