type QuizBotMessage = {
  type: "bot",
  id: string,
  text: string
};

type QuizUserMessage = {
  type: "bot",
  id: string,
  text: string
};

type QuizItem = QuizBotMessage | QuizUserMessage;

export const dunkersSwedishQuizItems: QuizItem[] = [
  { id: "0", type: "bot", text: "🤖" },
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
  { id: "6", type: "user", text: "Det har jag gjort" },
  { id: "7", type: "bot", text: "Vet du… jag har inget namn… 😭" },
  {
    id: "8",
    type: "bot",
    text:
      "Men du! Du som har ett så bra namn – kan inte du hitta på ett till mig?"
  },
  { id: "9", type: "user", text: "Okej, det kan jag göra." },
  { id: "10", type: "bot", text: "Ja! 😮🤩🤩" },
  {
    id: "11",
    type: "bot",
    text:
      "Du kanske kan skriva ner namnet i Kollprotokollet. Så att vi inte glömmer. Jag väntar här."
  },
  { id: "12", type: "user", text: "Fixat!" },
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
    type: "user",
    text: "Ja det kan jag väl!"
  },
  {
    id: "18",
    type: "bot",
    text: "Hurra! 🥳 En ny vän! Även om vi bara låtsas!"
  },
  {
    id: "19",
    type: "bot",
    text: "🥳🥳🥳"
  },
  {
    id: "20",
    type: "bot",
    text:
      "Nu när vi låtsas att vi är vänner, då är det ju som att det är sant… eller?"
  },
  {
    id: "21",
    type: "bot",
    text: "Åh det är svårt det där tycker jag. Vad som är sant."
  },
  {
    id: "22",
    type: "bot",
    text: "🤔"
  }
];
