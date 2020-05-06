import { ImageSourcePropType } from "react-native";
const robotImage = require("@assets/images/quiz/dunkers/robot.png");
const exhibitionRobotImage = require("@assets/images/quiz/dunkers/exhibition_robot.png");
const elseMarieImage = require("@assets/images/quiz/dunkers/else_marie.png");

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
  { id: "0", type: "botimage", source: robotImage, aspectRatio: 1 },
  { id: "1", type: "bot", text: "Hej!" },
  { id: "2", type: "bot", text: "Hallå!" },

  { id: "3", type: "bot", text: "Är du där? Kan du se mig?" },
  {
    id: "4",
    type: "bot",
    text: "Oj, jag menar…\nVälkommen hit, jag är här för att hjälpa dig!"
  },
  {
    id: "5",
    type: "bot",
    text: "Har du fyllt i de Väldigt Viktiga Uppgifterna i Kollprotokollet?"
  },
  { id: "6", type: "prompt", alternatives: [{ text: "Det har jag gjort" }] },
  { id: "7", type: "bot", text: "Vet du… jag har inget namn… 😭" },
  {
    id: "8",
    type: "bot",
    text:
      "Men du! Du som har ett så bra namn – kan inte du hitta på ett till mig?"
  },
  {
    id: "9",
    type: "prompt",
    alternatives: [{ text: "Okej, det kan jag göra." }]
  },
  { id: "10", type: "bot", text: "Ja! 😮🤩🤩" },
  {
    id: "11",
    type: "bot",
    text:
      "Du kanske kan skriva ner namnet i Kollprotokollet. Så att vi inte glömmer. Jag väntar här."
  },
  { id: "12", type: "prompt", alternatives: [{ text: "Fixat!" }] },
  { id: "13", type: "bot", text: "😭😍 Vilket fantastiskt namn. Tack!" },
  { id: "14", type: "bot", text: "Jag frågade om du kunde se mig förut." },
  {
    id: "15",
    type: "bot",
    text: "Det går ju inte riktigt. Jag finns ju bara i appen."
  },
  {
    id: "16",
    type: "bot",
    text:
      "Men! Vi kan hitta på att du kan se mig och att vi är jättebra vänner. 😀"
  },
  {
    id: "17",
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
    id: "18",
    type: "bot",
    text:
      "Nu när vi låtsas att vi är vänner, då är det ju som att det är sant… eller?"
  },
  {
    id: "19",
    type: "bot",
    text: "Åh det är svårt det där tycker jag. Vad som är sant."
  },
  {
    id: "20",
    type: "bot",
    text: "🤔"
  },
  {
    id: "21",
    type: "bot",
    text: "Vem bestämmer vad som är sant egentligen? Vad tycker du?"
  },
  {
    id: "22",
    type: "prompt",
    alternatives: [{ text: "Vi har diskuterat färdigt!" }]
  },
  {
    id: "23",
    type: "bot",
    text: "Förlåt, du kanske vill veta varför jag är här?"
  },
  {
    id: "24",
    type: "bot",
    text: "Jag är utställningens robot."
  },
  { id: "25", type: "botimage", source: exhibitionRobotImage, aspectRatio: 1 },
  {
    id: "26",
    type: "bot",
    text: "Alla utställningar har väl robotar?"
  },
  {
    id: "27",
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
    id: "28",
    type: "bot",
    text: "Nåja. Hur som helst."
  },
  {
    id: "29",
    type: "bot",
    text: "Jag är här för att visa dig utställningen! 🤗"
  },
  {
    id: "30",
    type: "bot",
    text: "Och sen har jag några uppdrag till dig."
  },
  {
    id: "31",
    type: "bot",
    text:
      "Och du verkar vara väldigt snäll. Så jag kanske ber dig om hjälp med några andra grejer också. 😬"
  },
  {
    id: "32",
    type: "bot",
    text: "Ser du ansiktet på Else-Marie?"
  },
  {
    id: "33",
    type: "bot",
    text: "Vi startar där borta!"
  },
  { id: "34", type: "botimage", source: elseMarieImage, aspectRatio: 1.4679 },
  {
    id: "35",
    type: "prompt",
    alternatives: [{ text: "Jag har hittat hit!" }]
  }
];
