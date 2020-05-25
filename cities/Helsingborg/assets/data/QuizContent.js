const robotImage = require("@assets/images/quiz/dunkers/robot.png");
const elseMarieImage = require("@assets/images/quiz/dunkers/else_marie.jpg");
const elseMarieFigurenImage = require("@assets/images/quiz/dunkers/siv.jpg");
const lillZlatanImage = require("@assets/images/quiz/dunkers/lill_zlatan.jpg");
const barnetImage = require("@assets/images/quiz/dunkers/gittan.jpg");
const vargarImage = require("@assets/images/quiz/dunkers/vargar.jpg");
const finishImage = require("@assets/images/quiz/dunkers/finish.png");
const shareImage = require("@assets/images/quiz/dunkers/shareimage.js");

export function getQuizForGuideId(langCode: string, guideId: number): ?Quiz {
  if (langCode === 'sv' && guideId === 1764975) { //TODO replace guideId with proper, this is using UNG SVENSK FORM
    return dunkersSwedishQuiz;
  }
  if (langCode === 'en' && guideId === 1765917) {  //TODO replace guideId with proper, this is using UNG SVENSK FORM
    return dunkersEnglishQuiz;
  }
  return null;
}

const dunkersSwedishQuizItems: QuizItem[] = [
  {
    id: "start-screen",
    type: "start",
    text: "Se till att du har hämtat Kollprotokollet och en penna i början av utställningen. De kommer vara jätteviktiga för vår resa! Tryck på knappen nedan när du är redo att börja prata med roboten.",
    image: {
      source: robotImage,
      aspectRatio: 1
    },
    action: {
      text: "Jag är redo"
    }
  },
  {
    id: "intro-chapter",
    type: "chapter",
    text: "Välkommen till Gråvargar och Älgbrorsor"
  },
  { id: "intro-1", type: "bot", text: "Hej!" },
  { id: "intro-2", type: "bot", text: "Hallå!" },
  { id: "intro-3", type: "bot", text: "Är du här? Kan du se mig?" },
  {
    id: "intro-4",
    type: "bot",
    text: "Oj, jag menar…\nVälkommen hit, jag är här för att hjälpa dig!"
  },
  {
    id: "intro-5",
    type: "bot",
    text: "Pappret du har heter Kollprotokollet längst upp finns några Väldigt viktiga uppgifter att fylla i. Har du gjort det?"
  },
  {
    id: "intro-6",
    type: "prompt",
    alternatives: [{ text: "Det har jag gjort", id: "intro-6-alt1" }]
  },
  { id: "intro-7", type: "bot", text: "Vet du… jag har inget namn… 😭" },
  {
    id: "intro-8",
    type: "bot",
    text:
      "Men du! Jag kan läsa att du har ett jättebra namn- kan inte du hitta på ett till mig?"
  },
  {
    id: "intro-9",
    type: "prompt",
    alternatives: [{ text: "Okej, det kan jag göra.", id: "intro-9-alt1" }]
  },
  { id: "intro-10", type: "bot", text: "Ja! 😮🤩🤩" },
  {
    id: "intro-11",
    type: "bot",
    text:
      "Du kanske kan skriva ner namnet i Kollprotokollet. Så att vi inte glömmer. Jag väntar här."
  },
  {
    id: "intro-12",
    type: "prompt",
    alternatives: [{ text: "Fixat!", id: "intro-12-alt1" }]
  },
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
        id: "intro-17-alt1",
        followups: [
          {
            text: "Hurra! 🥳 En ny vän! Även om vi bara låtsas!",
            id: "intro-17-alt1-fu1"
          },
          { text: "🥳🥳🥳", id: "intro-17-alt1-fu2" }
        ]
      },
      {
        text: "Fast vi känner ju inte varandra?",
        id: "intro-17-alt2",
        followups: [
          {
            id: "intro-17-alt2-fu1",
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
    type: "dialog",
    icon: "talk",
    title: "Diskutera tillsammans",
    instructions: "Jag väntar medan ni pratar. Tryck på knappen när ni är färdiga.",
    message: "Vem bestämmer vad som är sant egentligen? Vad tycker du?",
    alternatives: [{ text: "Vi har diskuterat färdigt!", id: "intro-21-alt1" }]
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
    source: robotImage,
    aspectRatio: 1
  },
  {
    id: "intro-26",
    type: "dialog",
    icon: "question",
    title: "Frågedags",
    instructions: "Välj ett svar och skicka iväg det när du är säker!",
    message: "Alla utställningar har väl robotar?",
    alternatives: [
      {
        id: "intro-27-alt1",
        text: "Nej, det tror jag inte? 🤔",
        followups: [
          {
            id: "intro-27-alt1-fu1",
            text: "Hmm... Ja, då är det bara jag kanske?"
          },
          { id: "intro-27-alt1-fu2", text: "Så spännande! 😀" }
        ]
      },
      {
        id: "intro-27-alt2",
        text: "Inte alla, men några kanske?",
        followups: [
          { id: "intro-27-alt2-fu1", text: "Några robotar! Coolt!" },
          { id: "intro-27-alt2-fu2", text: "Undra om jag kan träffa dem?" }
        ]
      },
      {
        text: "Ja! Såklart de har!",
        id: "intro-27-alt3",
        followups: [
          { id: "intro-27-alt3-fu1", text: "Åh vad kul! 😄" },
          {
            id: "intro-27-alt3-fu2",
            text: "Jag får leta reda på någon annan robot någon dag!"
          }
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
    text: "Kan du hitta Else-Maries ansikte?"
  },
  {
    id: "intro-33",
    type: "bot",
    text: "Det ser ut såhär:"
  },
  {
    id: "intro-34",
    type: "botimage",
    source: elseMarieImage,
    aspectRatio: 1.4679
  },
  {
    id: "intro-35",
    type: "dialog",
    icon: "look",
    title: "Dags att leta",
    instructions: "Titta runt om i utställningen",
    message: "Ser du Else-Maries ansikte?",
    alternatives: [{ id: "intro-35-alt1", text: "Jag har hittat hit!" }]
  },
  {
    id: "elsemarie-chapter",
    type: "chapter",
    text: "Else-Marie och småpapporna"
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
        id: "elsemarie-3-alt1",
        text: "Ja, oftast!",
        followups: [
          { id: "elsemarie-3-alt1-fu1", text: "Intressant!" },
          { id: "elsemarie-3-alt1-fu2", text: "Tror jag…" },
          { id: "elsemarie-3-alt1-fu3", text: "Jag har aldrig läst någon bok." }
        ]
      },
      {
        id: "elsemarie-3-alt2",
        text: "Nej, kanske ibland.",
        followups: [
          {
            id: "elsemarie-3-alt2-fu1",
            text: "Vet du, jag har faktiskt aldrig läst någon bok."
          },
          {
            id: "elsemarie-3-alt2-fu2",
            text: "Vi skulle kunna läsa tillsammans någon dag! 😊"
          }
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
    text: "🦶🦶🦶🦶🦶🦶🦶"
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
    id: "elsemarie-10",
    type: "dialog",
    icon: "question",
    title: "Frågedags",
    instructions: "Välj ett svar och skicka iväg det när du är säker!",
    message: "Hur många fötter hittar du?",
    alternatives: [
      {
        id: "elsemarie-10-alt1",
        text: "12",
        correct: false,
        followups: [
          {
            id: "elsemarie-10-alt1-fu1",
            text: "Hmm...stämmer det verkligen?🤔"
          }
        ]
      },
      {
        id: "elsemarie-10-alt2",
        text: "16",
        correct: true,
        followups: [{ id: "elsemarie-10-alt2-fu1", text: "Perfekt! Tack!" }]
      },
      {
        id: "elsemarie-10-alt3",
        text: "1000",
        correct: false,
        followups: [
          { id: "elsemarie-10-alt3-fu1", text: "Är du säker? Räkna igen!" }
        ]
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
    type: "dialog",
    icon: "talk",
    title: "Diskutera tillsammans",
    instructions: "Jag väntar medan ni pratar. Tryck på knappen när ni är färdiga.",
    message: "Hur tror du det skulle vara att ha sju pappor?",
    alternatives: [
      {
        id: "elsemarie-15-alt1",
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
    text: "Vet du, här finns fler böcker! 📖📖📖"
  },
  {
    id: "elsemarie-19",
    type: "bot",
    text: "Titta på den här bilden:"
  },
  {
    id: "elsemarie-20",
    type: "botimage",
    source: elseMarieFigurenImage,
    aspectRatio: 1.4679
  },
  {
    id: "elsemarie-21",
    type: "dialog",
    icon: "look",
    title: "Dags att leta",
    instructions: "Titta runt om i utställningen",
    message: "Kan du ta dig till där du kan se figuren på bilden?",
    alternatives: [
      {
        id: "elsemarie-21-alt1",
        text: "Jag är framme!"
      }
    ]
  },
  {
    id: "siv-chapter",
    type: "chapter",
    text: "Siv sover vilse"
  },
  {
    id: "siv-00",
    type: "bot",
    text: "Det är Siv."
  },
  {
    id: "siv-0",
    type: "bot",
    text: "Och här ligger visst Cerisia och sover! 😴"
  },
  {
    id: "siv-1",
    type: "bot",
    text:
      "Men Siv är vaken. Hon sover över hos Cerisia. För första gången någonsin! 😮"
  },
  {
    id: "siv-2",
    type: "dialog",
    icon: "question",
    title: "Frågedags",
    instructions: "Välj ett svar och skicka iväg det när du är säker!",
    message: "Hur tror du att Siv känner sig? ",
    alternatives: [
      {
        id: "siv-3-alt1",
        text: "Hon ser lite ledsen ut",
        followups: [
          {
            id: "siv-3-alt1-fu1",
            text: "Hon kan kanske inte somna. Om hon hälsar på hos en kompis."
          },
          {
            id: "siv-3-alt1-fu2",
            text: "Det kan vara läskigt att sova på en ny plats."
          }
        ]
      },
      {
        id: "siv-3-alt2",
        text: "Jag tycker hon verkar okej",
        followups: [
          { id: "siv-3-alt2-fu1", text: "Åh vad bra! ☺" },
          {
            id: "siv-3-alt2-fu2",
            text: "Hon kanske bara har svårt att somna på en ny plats."
          }
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
        id: "siv-8-alt1",
        text: "Ja, det har jag.",
        followups: [
          { id: "siv-8-alt1-fu1", text: "Det låter lite jobbigt. Tror jag." },
          {
            id: "siv-8-alt1-fu2",
            text: "Robotar sover inte. Eller, ibland ligger jag helt stilla och blundar och drömmer. "
          }
        ]
      },
      {
        id: "siv-8-alt2",
        text: "Nej, nästan aldrig.",
        followups: [
          { id: "siv-8-alt2-fu1", text: "Vet du, jag sover aldrig." },
          {
            id: "siv-8-alt2-fu2",
            text: "Robotar sover inte. Eller, ibland ligger jag helt stilla och blundar och drömmer. "
          }
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
        id: "siv-12-alt1",
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
    type: "dialog",
    icon: "question",
    title: "Frågedags",
    instructions: "Välj ett svar och skicka iväg det när du är säker!",
    message: "Hur vet man att drömmar inte är på riktigt?",
    alternatives: [
      {
        id: "siv-17-alt1",
        text: "När man vaknar är man kvar i sängen."
      },
      {
        id: "siv-17-alt2",
        text: "Det händer konstiga saker som inte kan hända."
      },
      {
        id: "siv-17-alt3",
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
    type: "dialog",
    icon: "talk",
    title: "Diskutera tillsammans",
    instructions: "Jag väntar medan ni pratar. Tryck på knappen när ni är färdiga.",
    message: "Har du drömt något roligt eller spännande någongång?",
    alternatives: [
      {
        id: "siv-23-alt1",
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
    type: "dialog",
    icon: "look",
    title: "Dags att leta",
    instructions: "Titta runt om i utställningen",
    message: "Kan du hitta figuren?",
    alternatives: [
      {
        id: "lillzlatan-3-alt1",
        text: "Hittat!"
      }
    ]
  },
  {
    id: "lillzlatan-chapter",
    type: "chapter",
    text: "Lill-Zlatan och Morbror Raring"
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
    type: "dialog",
    icon: "talk",
    title: "Diskutera tillsammans",
    instructions: "Jag väntar medan ni pratar. Tryck på knappen när ni är färdiga.",
    message:
      "Berätta för varandra varför ni tror att Ella ser lite arg ut och det ligger toapapper i handfatet",
    alternatives: [
      {
        id: "lillzlatan-8-alt1",
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
        id: "lillzlatan-13-alt1",
        text: "Nej!",
        followups: [
          {
            id: "lillzlatan-13-alt1-fu1",
            text: "Nä, ofta tror man inte samma."
          },
          {
            id: "lillzlatan-13-alt1-fu2",
            text: "Vi tittar på samma bild och ändå ser vi helt olika saker."
          }
        ]
      },
      {
        id: "lillzlatan-13-alt2",
        text: "Ja, precis samma!",
        followups: [
          {
            id: "lillzlatan-13-alt2-fu1",
            text: "Oj! Tänk att vi tänker likadant."
          },
          {
            id: "lillzlatan-13-alt2-fu2",
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
      "Kan du kolla vilken ordning de är i på väggen och sedan skriva ett nummer vid varje?",
  },
  {
    id: "lillzlatan-19",
    type: "prompt",
    alternatives: [
      {
        id: "lillzlatan-18-alt1",
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
    text: "Titta på den här bilden"
  },
  {
    id: "lillzlatan-27",
    type: "botimage",
    source: barnetImage,
    aspectRatio: 1
  },
  {
    id: "lillzlatan-28",
    type: "dialog",
    icon: "look",
    title: "Dags att leta",
    instructions: "Titta runt om i utställningen",
    message: "Kan du hitta barnet som ser ut såhär?",
    alternatives: [
      {
        id: "lillzlatan-28-alt1",
        text: "Här är hen!"
      }
    ]
  },
  {
    id: "gittan-chapter",
    type: "chapter",
    text: "Gittan och Älgbrorsorna"
  },
  {
    id: "gittan-0",
    type: "bot",
    text: "Vad mycket lego! Så kul!"
  },
  {
    id: "gittan-1",
    type: "bot",
    text: "Jag skulle vilja bygga en vulkan! 🌋"
  },
  {
    id: "gittan-2",
    type: "bot",
    text: "Eller en 🚀🛸"
  },
  {
    id: "gittan-3",
    type: "bot",
    text: "Eller ett hus att bo i!"
  },
  {
    id: "gittan-4",
    type: "dialog",
    icon: "talk",
    title: "Diskutera tillsammans",
    instructions: "Jag väntar medan ni pratar. Tryck på knappen när ni är färdiga.",
    message:
      "Om du hade hur många legobitar som helst. Vad skulle du bygga då?",
    alternatives: [
      {
        id: "gittan-4-alt1",
        text: "Vi har pratat färdigt!"
      }
    ]
  },
  {
    id: "gittan-6",
    type: "bot",
    text: "Coolt!"
  },
  {
    id: "gittan-7",
    type: "bot",
    text: "Verkar vara många olika färger på legobitarna."
  },
  {
    id: "gittan-8",
    type: "bot",
    text: "Undra om det är tillräckligt många? 🤔"
  },
  {
    id: "gittan-9",
    type: "bot",
    text: "Det måste jag rapportera varje dag i Kollprotokollet. Nummer 4."
  },
  {
    id: "gittan-10",
    type: "bot",
    text: "Kan du kryssa för alla färger du hittar?"
  },
  {
    id: "gittan-11",
    type: "prompt",
    alternatives: [
      {
        id: "gittan-10-alt1",
        text: "Klart!"
      }
    ]
  },
  {
    id: "gittan-12",
    type: "bot",
    text: "Tack så mycket! 🙏"
  },
  {
    id: "gittan-13",
    type: "bot",
    text: "Det var snällt av dig!"
  },
  {
    id: "gittan-14",
    type: "bot",
    text: "Hoppas det var tillräckligt många färger idag."
  },
  {
    id: "gittan-15",
    type: "bot",
    text: "Men du…"
  },
  {
    id: "gittan-16",
    type: "bot",
    text: "Älgar bor ju oftast i skogen. 🌲🌱"
  },
  {
    id: "gittan-18",
    type: "dialog",
    icon: "question",
    title: "Frågedags",
    instructions: "Välj ett svar och skicka iväg det när du är säker!",
    message: "Tror du det är bra med älgar i lägenhet?",
    alternatives: [
      {
        id: "gittan-18-alt1",
        text: "Nej, de ska bo i skogen!",
        followups: [
          { id: "gittan-18-alt1-fu1", text: "Ja, det är nog bäst kanske?" }
        ]
      },
      {
        id: "gittan-18-alt2",
        text: "Ja, det vore kul tror jag!",
        followups: [
          {
            id: "gittan-18-alt2-fu1",
            text: "Då har nog Gittan väldigt kul! Tre älgar!"
          }
        ]
      }
    ]
  },
  {
    id: "gittan-19",
    type: "bot",
    text: "Vet du! Vi har ju en skog här borta!"
  },
  {
    id: "gittan-20",
    type: "bot",
    text: "Där kanske de kan bo?"
  },
  {
    id: "gittan-21",
    type: "bot",
    text: "Skogen är jättenära."
  },
  {
    id: "gittan-22",
    type: "dialog",
    icon: "look",
    title: "Dags att leta",
    instructions: "Titta runt om i utställningen",
    message: "Kan du hitta skogen?",
    alternatives: [
      {
        id: "gittan-21-alt1",
        text: "Jag har hittat den!"
      }
    ]
  },
  {
    id: "skogen-chapter",
    type: "chapter",
    text: "Gittan och Gråvargarna"
  },
  {
    id: "gittan-23",
    type: "bot",
    text: "Oj! Hjälp! 😲"
  },
  {
    id: "gittan-24",
    type: "bot",
    text: "Där borta!"
  },
  {
    id: "gittan-25",
    type: "bot",
    text: "Är det en varg?"
  },
  {
    id: "gittan-26",
    type: "bot",
    text: "Gå försiiiiktigt fram till den!"
  },
  {
    id: "gittan-27",
    type: "bot",
    text: "Smyg fram!"
  },
  {
    id: "gittan-28",
    type: "prompt",
    alternatives: [
      {
        id: "gittan-28-alt1",
        text: "Okej! Jag har smugit fram!"
      }
    ]
  },
  {
    id: "skogen-0",
    type: "bot",
    text: "🐺🤫🤫🤫🤫"
  },
  {
    id: "skogen-1",
    type: "bot",
    text: "Vad tror du, verkar vargen snäll?"
  },
  {
    id: "skogen-2",
    type: "prompt",
    alternatives: [
      {
        id: "skogen-2-alt1",
        text: "Ja, det är den!",
        followups: [
          { id: "skogen-2-alt1-fu1", text: "Åh vilken tur! ☺" },
          { id: "skogen-2-alt1-fu2", text: "Då ska jag inte vara rädd!" }
        ]
      },
      {
        id: "skogen-2-alt2",
        text: "Nej, det tror jag inte!",
        followups: [
          { id: "skogen-2-alt2-fu1", text: "Ojdå!😬" },
          { id: "skogen-2-alt2-fu2", text: "Då får vi vara försiktiga!" }
        ]
      }
    ]
  },
  {
    id: "skogen-3",
    type: "bot",
    text: "Vet du, jag har sett många barn som klappat vargen!"
  },
  {
    id: "skogen-4",
    type: "bot",
    text: "Jag har ju inga händer men…"
  },
  {
    id: "skogen-5",
    type: "bot",
    text: "Du kanske kan testa?"
  },
  {
    id: "skogen-6",
    type: "bot",
    text: "Klappa försiktigt."
  },
  {
    id: "skogen-7",
    type: "bot",
    text: "Det tror jag vargar tycker om! 🐺"
  },
  {
    id: "skogen-8",
    type: "prompt",
    alternatives: [
      {
        id: "skogen-8-alt1",
        text: "Jag klappade vargen!",
        followups: [
          { id: "skogen-8-alt1-fu1", text: "Wow, vad du är modig!" },
        ]
      },
      {
        id: "skogen-8-alt2",
        text: "Jag vill inte göra det",
        followups: [
          { id: "skogen-8-alt2-fu1", text: "Det är okej, jag hade inte heller velat göra det... 😬" },
        ]
      }
    ]
  },
  {
    id: "skogen-9",
    type: "bot",
    text: "Så många träd här är…😮"
  },
  {
    id: "skogen-10",
    type: "bot",
    text: "🌲🌲🌲🌲🌲🌲🌲🌲🌲"
  },
  {
    id: "skogen-11",
    type: "bot",
    text: "Har du varit i en skog någon gång?"
  },
  {
    id: "skogen-12",
    type: "prompt",
    alternatives: [
      {
        id: "skogen-12-alt1",
        text: "Nej, det har jag inte.",
        followups: [
          {
            id: "skogen-12-alt1-fu1",
            text: "Jag har heller aldrig varit i skogen!"
          }
        ]
      },
      {
        id: "skogen-12-alt2",
        text: "Ja det har har jag.",
        followups: [
          {
            id: "skogen-12-alt2-fu1",
            text: "Var det spännande? Kul? Läskigt? luktade det gott?"
          }
        ]
      }
    ]
  },
  {
    id: "skogen-13",
    type: "bot",
    text: "Här är det ju som en skog. Och här verkar rätt mysigt."
  },
  {
    id: "skogen-14",
    type: "bot",
    text: "Tänk om man skulle vara ett djur som bor i skogen."
  },
  {
    id: "skogen-15",
    type: "bot",
    text: "Kanske en 🦔"
  },
  {
    id: "skogen-16",
    type: "bot",
    text: "Eller en 🦉"
  },
  {
    id: "skogen-17",
    type: "bot",
    text: "Eller kanske något helt annat? 🤔"
  },
  {
    id: "skogen-18",
    type: "dialog",
    icon: "talk",
    title: "Diskutera tillsammans",
    instructions: "Jag väntar medan ni pratar. Tryck på knappen när ni är färdiga.",
    message: "Hur tror du det skulle vara att bo i skogen?",
    alternatives: [
      {
        id: "skogen-18-alt1",
        text: "Vi är färdigpratade!"
      }
    ]
  },
  {
    id: "skogen-20",
    type: "bot",
    text: "Just det ja! Nu minns jag varför vi är här!"
  },
  {
    id: "skogen-21",
    type: "bot",
    text: "Jag måste kontrollera hur många grenar det är i skogen."
  },
  {
    id: "skogen-22",
    type: "bot",
    text: "Kan du hjälpa mig?"
  },
  {
    id: "skogen-23",
    type: "bot",
    text:
      "När du räknat alla grenar skriv ner dem i Kollprotokollet på nummer 5."
  },
  {
    id: "skogen-24",
    type: "prompt",
    alternatives: [
      {
        id: "skogen-22-alt1",
        text: "Okej! Räknat och nedskrivet!"
      }
    ]
  },
  {
    id: "skogen-25",
    type: "bot",
    text: "Tack! 😊"
  },
  {
    id: "skogen-26",
    type: "bot",
    text: "Det är tur jag har dig!"
  },
  {
    id: "skogen-27",
    type: "bot",
    text: "😍😍😍"
  },
  {
    id: "skogen-28",
    type: "bot",
    text: "Det är svårt för mig att kolla allt som ska kollas annars..."
  },
  {
    id: "skogen-29",
    type: "bot",
    text: "Men du! 🤨 Det var bara EN varg där borta va?"
  },
  {
    id: "skogen-30",
    type: "bot",
    text: "Det ska finnas fler... De ser ut såhär:"
  },
  {
    id: "skogen-32",
    type: "botimage",
    source: vargarImage,
    aspectRatio: 1.4679
  },
  {
    id: "skogen-33",
    type: "dialog",
    icon: "look",
    title: "Dags att leta",
    instructions: "Titta runt om i utställningen",
    message: "Kan du hitta dem?",
    alternatives: [
      {
        id: "skogen-33-alt1",
        text: "Jag har hittat dem!"
      }
    ]
  },
  {
    id: "avslutning-chapter",
    type: "chapter",
    text: "Avslutning"
  },
  {
    id: "avslutning-0",
    type: "bot",
    text: "Här var ju alla vargarna! 🐺🐺🐺"
  },
  {
    id: "avslutning-1",
    type: "bot",
    text: "Kan du räkna hur många de är och skriva ner i Kollprotokollet?"
  },
  {
    id: "avslutning-2",
    type: "prompt",
    alternatives: [
      {
        id: "avslutning-2-alt1",
        text: "Fixat!"
      }
    ]
  },
  {
    id: "avslutning-3",
    type: "bot",
    text: "Tack! 🙏🏾"
  },
  {
    id: "avslutning-4",
    type: "bot",
    text: "Det är väldigt mycket räknande här inne…"
  },
  {
    id: "avslutning-5",
    type: "bot",
    text:
      "Som att de tror att bara för att jag är en robot, så kan jag en massa matte."
  },
  {
    id: "avslutning-6",
    type: "bot",
    text: "Är du bra på matte?"
  },
  {
    id: "avslutning-7",
    type: "prompt",
    alternatives: [
      {
        id: "avslutning-7-alt1",
        text: "Ganska så bra",
        followups: [
          {
            id: "avslutning-7-alt1-fu1",
            text: "Jag tycker du verkar jättebra!"
          },
          { id: "avslutning-7-alt1-fu2", text: "Du har hjälpt mig så mycket!" }
        ]
      },
      {
        id: "avslutning-7-alt2",
        text: "Ja, det är jag!",
        followups: [
          {
            id: "avslutning-7-alt2-fu1",
            text: "Vilken tur! Då har det varit lätt för dig att hjälpa mig!"
          }
        ]
      },
      {
        id: "avslutning-7-alt3",
        text: "Nej, inte jätte",
        followups: [
          {
            id: "avslutning-7-alt3-fu1",
            text: "Och tänk att du hjälpt mig så bra ändå!"
          },
          { id: "avslutning-7-alt3-fu2", text: "Wow!" }
        ]
      }
    ]
  },
  {
    id: "avslutning-8",
    type: "bot",
    text: "Det känns nästan som vi är vänner på riktigt nu. 😍😍"
  },
  {
    id: "avslutning-9",
    type: "bot",
    text: "Du har varit så snäll."
  },
  {
    id: "avslutning-10",
    type: "bot",
    text: "Tack för all din hjälp!! Nu är det bara en sak kvar."
  },
  {
    id: "avslutning-11",
    type: "bot",
    text: "Om du tar och delar Kollprotkollet nu. Längs den där linjen."
  },
  {
    id: "avslutning-12",
    type: "prompt",
    alternatives: [
      {
        id: "avslutning-12-alt1",
        text: "Okej, jag har gjort det nu!"
      }
    ]
  },
  {
    id: "avslutning-13",
    type: "bot",
    text: "Och så lägger du halvan med allt du hjälp mig med i lådan där borta."
  },
  {
    id: "avslutning-14",
    type: "bot",
    text: "Den töms varje natt kl 03.18"
  },
  {
    id: "avslutning-15",
    type: "bot",
    text:
      "Då kommer all information du skrivit ner vara jättenödvändig. Så vi kan kolla att allt är som det ska i utställningen."
  },
  {
    id: "avslutning-16",
    type: "dialog",
    icon: "question",
    title: "Dags att lämna in ena halvan av Kollprotokollet",
    instructions: "Lämna in halvan som du har fyllt i",
    message: "Har du lagt lappen i lådan?",
    alternatives: [
      {
        id: "avslutning-16-alt1",
        text: "Jag har lagt lappen i lådan!"
      }
    ]
  },
  {
    id: "avslutning-17",
    type: "bot",
    text: "Den andra delen, med Väldigt Viktig Information, måste du behålla."
  },
  {
    id: "avslutning-18",
    type: "bot",
    text: "Sån Information måste man ju hålla reda på."
  },
  {
    id: "avslutning-19",
    type: "bot",
    text: "Som tack för att du hjälpte mig kan du ta med dig pennan också."
  },
  {
    id: "avslutning-20",
    type: "bot",
    text: "Kanske kan du hjälpa någon annan robot."
  },
  {
    id: "avslutning-21",
    type: "bot",
    text: "Du får gärna komma tillbaka en annan gång!"
  },
  {
    id: "avslutning-22",
    type: "bot",
    text: "Tryck nu på knappen här nere så får du en bild som minne av vår tid i utställningen!"
  },
  {
    id: "avslutning-23",
    type: "bot",
    text: "Hej då! 😍😃🙏🏾⭐🎈"
  },
  {
    id: "finished-chapter",
    type: "chapter",
    text: "Tryck på knappen så avslutar du chatten och får en bild"
  },
  {
    id: "avslutning-24",
    type: "prompt",
    alternatives: [{ id: "avslutning-24-alt1", text: "Hej då! 👋" }]
  }
];

const dunkersSwedishQuiz: Quiz = {
  name: 'Robothjälpen',
  items: dunkersSwedishQuizItems,
  openTitle: 'Öppna utställningens interaktiva guide',
  finishScreen: {
    title: 'Gråvargar och Älgbrorsor',
    firstImage: finishImage,
    secondImage: robotImage,
    shareImage: shareImage.default,
    shareString: 'Dela resultat',
    body: {
      title: 'Grattis!',
      text: "Bra jobbat! Du hjälpte verkligen roboten jättebra, tack! Om du gillade Robothjälpen så dela med dina kompisar!"
    }
  }
};

const dunkersEnglishQuizItems: QuizItem[] = [
  {
    id: "start-screen",
    type: "start",
    text: "Make sure that you have picked up your Recording Record and a pen at the beginning of the exhibition. This will be very important for our journey! Tap the button below when you are ready to start the conversation with the robot.",
    image: {
      source: robotImage,
      aspectRatio: 1
    },
    action: {
      text: "I’m ready"
    }
  },
  {
    id: "intro-chapter",
    type: "chapter",
    text: "Welcome to Grey Wolves and Moose Brothers"
  },
  { id: "intro-1", type: "bot", text: "Hi there!" },
  { id: "intro-2", type: "bot", text: "Hello!" },
  { id: "intro-3", type: "bot", text: "Are you here? Can you see me?" },
  {
    id: "intro-4",
    type: "bot",
    text: "Well, I mean...\nWelcome! I am here to help you!"
  },
  {
    id: "intro-5",
    type: "bot",
    text: "The paper you have is called the Recording Record. At the top, you can find the Very Important Details and it is very important that you fill them in. Have you done this?"
  },
  {
    id: "intro-6",
    type: "prompt",
    alternatives: [{ text: "Yes, I have!", id: "intro-6-alt1" }]
  },
  { id: "intro-7", type: "bot", text: "You know... I haven’t got a name... 😭" },
  {
    id: "intro-8",
    type: "bot",
    text:
      "But I can read that you have such a great name. Can you give me a name?"
  },
  {
    id: "intro-9",
    type: "prompt",
    alternatives: [{ text: "Sure, I can do that!", id: "intro-9-alt1" }]
  },
  { id: "intro-10", type: "bot", text: "Yay! 😮🤩🤩" },
  {
    id: "intro-11",
    type: "bot",
    text:
      "Can you write my name in the Recording Record? Then we won’t forget it! I’ll wait here."
  },
  {
    id: "intro-12",
    type: "prompt",
    alternatives: [{ text: "Done!", id: "intro-12-alt1" }]
  },
  { id: "intro-13", type: "bot", text: "😭😍 What an amazing name! Thank you!" },
  {
    id: "intro-14",
    type: "bot",
    text: " Earlier I asked if you could see me."
  },
  {
    id: "intro-15",
    type: "bot",
    text: "Well, you can’t really. I only exist inside the app."
  },
  {
    id: "intro-16",
    type: "bot",
    text:
      "But maybe we can pretend that you can see me and that we are really good friends! Can we do that?"
  },
  {
    id: "intro-17",
    type: "prompt",
    alternatives: [
      {
        text: "Yes, definitely!",
        id: "intro-17-alt1",
        followups: [
          {
            text: "Wow! A new friend! Even if it’s only pretend.",
            id: "intro-17-alt1-fu1"
          },
          { text: "🥳🥳🥳", id: "intro-17-alt1-fu2" }
        ]
      },
      {
        text: "Well, we don’t really know each other",
        id: "intro-17-alt2",
        followups: [
          {
            id: "intro-17-alt2-fu1",
            text:
              "No, you are right. But if we just pretend we are friends it doesn’t really have to be true 😊 ",
          },
          { text: "🥳🥳🥳", id: "intro-17-alt2-fu2" }
        ]
      }
    ]
  },
  {
    id: "intro-18",
    type: "bot",
    text:
      "Ok, so now we pretend that we are friends! Then it’s almost as if it were true... or not?"
  },
  {
    id: "intro-19",
    type: "bot",
    text: "I find that it’s a bit hard to know what is really true."
  },
  {
    id: "intro-20",
    type: "bot",
    text: "🤔"
  },
  {
    id: "intro-21",
    type: "dialog",
    icon: "talk",
    title: "Time to discuss together",
    instructions: "Take your time, I’ll be here. Let me know when you are done",
    message: "Who decides what is true and what isn’t? What do you think?",
    alternatives: [{ text: "We’ve finished discussing!", id: "intro-21-alt1" }]
  },
  {
    id: "intro-23",
    type: "bot",
    text: "Sorry, would you like to know what I’m doing here?"
  },
  {
    id: "intro-24",
    type: "bot",
    text: "I am the exhibition robot."
  },
  {
    id: "intro-25",
    type: "botimage",
    source: robotImage,
    aspectRatio: 1
  },
  {
    id: "intro-26",
    type: "dialog",
    icon: "question",
    title: "Time for a question",
    instructions: "Select an answer and tap on send when you are sure!",
    message: "All exhibitions have robots, right?",
    alternatives: [
      {
        id: "intro-27-alt1",
        text: "No, I don’t think so 🤔",
        followups: [
          {
            id: "intro-27-alt1-fu1",
            text: "Oh well... It’s just me then."
          },
          { id: "intro-27-alt1-fu2", text: "How exiting! 😀" }
        ]
      },
      {
        id: "intro-27-alt2",
        text: "Not all, but maybe some exhibitions",
        followups: [
          { id: "intro-27-alt2-fu1", text: "A few robots then! How cool!" },
          { id: "intro-27-alt2-fu2", text: "I wonder if I get to meet them someday..." }
        ]
      },
      {
        text: "Yes! Of course they do!",
        id: "intro-27-alt3",
        followups: [
          { id: "intro-27-alt3-fu1", text: "Oh, how wonderful! 😄 " },
          {
            id: "intro-27-alt3-fu2",
            text: "I have to find another robot someday then!"
          }
        ]
      }
    ]
  },
  {
    id: "intro-28",
    type: "bot",
    text: "Well, anyhow."
  },
  {
    id: "intro-29",
    type: "bot",
    text: "I am here to show you the exhibition! 🤗"
  },
  {
    id: "intro-30",
    type: "bot",
    text: "And I have a few tasks for you."
  },
  {
    id: "intro-31",
    type: "bot",
    text:
      "And you seem really nice. So I might ask you for help with a few other things as well. 😬"
  },
  {
    id: "intro-32",
    type: "bot",
    text: "Can you find Else-Marie’s face? We’ll start over there!"
  },
  {
    id: "intro-33",
    type: "bot",
    text: "This is how it looks:"
  },
  {
    id: "intro-34",
    type: "botimage",
    source: elseMarieImage,
    aspectRatio: 1.4679
  },
  {
    id: "intro-35",
    type: "dialog",
    icon: "look",
    title: "Time to find something",
    instructions: "Look around in the exhibition",
    message: "Can you find Else-Marie’s face?",
    alternatives: [{ id: "intro-35-alt1", text: "I have found it!" }]
  },
  {
    id: "elsemarie-chapter",
    type: "chapter",
    text: "Else- Marie and her seven little daddies"
  },
  {
    id: "elsemarie-0",
    type: "bot",
    text: "Look! :D"
  },
  {
    id: "elsemarie-1",
    type: "bot",
    text: "It’s like a giant book! 📖"
  },
  {
    id: "elsemarie-2",
    type: "bot",
    text: "Do you like to read books?"
  },
  {
    id: "elsemarie-3",
    type: "prompt",
    alternatives: [
      {
        id: "elsemarie-3-alt1",
        text: "Yes, most of the time.",
        followups: [
          { id: "elsemarie-3-alt1-fu1", text: "Interesting!" },
          { id: "elsemarie-3-alt1-fu2", text: "I think..." },
          { id: "elsemarie-3-alt1-fu3", text: "I have never actually read a book." }
        ]
      },
      {
        id: "elsemarie-3-alt2",
        text: "No, maybe sometimes.",
        followups: [
          {
            id: "elsemarie-3-alt2-fu1",
            text: "You know what, I have never actually read a book."
          },
          {
            id: "elsemarie-3-alt2-fu2",
            text: "Maybe we could read together someday! 😊"
          }
        ]
      }
    ]
  },
  {
    id: "elsemarie-4",
    type: "bot",
    text: "By the way, have you ever seen so many feet?"
  },
  {
    id: "elsemarie-5",
    type: "bot",
    text: "It’s like a thousand feet!"
  },
  {
    id: "elsemarie-6",
    type: "bot",
    text: "🦶🦶🦶🦶🦶🦶🦶"
  },
  {
    id: "elsemarie-7",
    type: "bot",
    text: "Well.. Maybe not a thousand..."
  },
  {
    id: "elsemarie-8",
    type: "bot",
    text: "I’m not very good at counting."
  },
  {
    id: "elsemarie-10",
    type: "dialog",
    icon: "question",
    title: "Time for a question",
    instructions: "Select an answer and tap on send when you are sure!",
    message: "How many feet do you see?",
    alternatives: [
      {
        id: "elsemarie-10-alt1",
        text: "12",
        correct: false,
        followups: [
          {
            id: "elsemarie-10-alt1-fu1",
            text: "Are you sure that’s correct? 🤔"
          }
        ]
      },
      {
        id: "elsemarie-10-alt2",
        text: "16",
        correct: true,
        followups: [{ id: "elsemarie-10-alt2-fu1", text: "Perfect! Thank you!" }]
      },
      {
        id: "elsemarie-10-alt3",
        text: "1000",
        correct: false,
        followups: [
          { id: "elsemarie-10-alt3-fu1", text: "Are you certain? Count again!" }
        ]
      }
    ]
  },
  {
    id: "elsemarie-11",
    type: "bot",
    text: "Ok, sixteen feet. Good to know!"
  },
  {
    id: "elsemarie-12",
    type: "bot",
    text: "Else-Marie, the girl with the board game, she has seven dads!"
  },
  {
    id: "elsemarie-13",
    type: "bot",
    text: "It’s their feet you see under the🦶📄📄🦶🦶🦶🦶🦶🦶🦶🦶🦶"
  },
  {
    id: "elsemarie-14",
    type: "bot",
    text: "Imagine having seven dads."
  },
  {
    id: "elsemarie-15",
    type: "dialog",
    icon: "talk",
    title: "Time to discuss together",
    instructions: "Take your time, I’ll be here. Let me know when you are done",
    message: "How to you think it would be to have seven dads?",
    alternatives: [
      {
        id: "elsemarie-15-alt1",
        text: "We’re done talking about this!"
      }
    ]
  },
  {
    id: "elsemarie-17",
    type: "bot",
    text: "Interesting!"
  },
  {
    id: "elsemarie-18",
    type: "bot",
    text: "You know, there are more big books here! 📖📖📖"
  },
  {
    id: "elsemarie-19",
    type: "bot",
    text: "Now, look at this image:"
  },
  {
    id: "elsemarie-20",
    type: "botimage",
    source: elseMarieFigurenImage,
    aspectRatio: 1.4679
  },
  {
    id: "elsemarie-21",
    type: "dialog",
    icon: "look",
    title: "Time to find something",
    instructions: "Look around in the exhibition",
    message: "Can you find the person on the image?",
    alternatives: [
      {
        id: "elsemarie-21-alt1",
        text: "I have found them!"
      }
    ]
  },
  {
    id: "siv-chapter",
    type: "chapter",
    text: "Siv sleeps astray"
  },
  {
    id: "siv-00",
    type: "bot",
    text: "This is Siv!"
  },
  {
    id: "siv-0",
    type: "bot",
    text: "And that’s Cerisia sleeping!"
  },
  {
    id: "siv-1",
    type: "bot",
    text:
      "But Siv is awake. She’s having a sleepover at Cerisia’s. For the first time ever!"
  },
  {
    id: "siv-2",
    type: "dialog",
    icon: "question",
    title: "Time for a question",
    instructions: "Select an answer and tap on send when you are sure!",
    message: "How do you think Siv feels?",
    alternatives: [
      {
        id: "siv-3-alt1",
        text: "She seems a bit worried",
        followups: [
          {
            id: "siv-3-alt1-fu1",
            text: "Maybe she can’t fall asleep when she is visiting a friend."
          },
          {
            id: "siv-3-alt1-fu2",
            text: "It can be scary to sleep in a new place."
          }
        ]
      },
      {
        id: "siv-3-alt2",
        text: "I think she’s feeling ok",
        followups: [
          { id: "siv-3-alt2-fu1", text: "That’s a relief! ☺" },
          {
            id: "siv-3-alt2-fu2",
            text: "Maybe she just has a hard time falling asleep at a new place."
          }
        ]
      }
    ]
  },
  {
    id: "siv-4",
    type: "bot",
    text: "It’s not always so easy, falling asleep in a new room. "
  },
  {
    id: "siv-5",
    type: "bot",
    text: "Everything is different. And it smells all wrong."
  },
  {
    id: "siv-6",
    type: "bot",
    text: "Then it can be quite hard to fall asleep."
  },
  {
    id: "siv-7",
    type: "bot",
    text: "Do you find it hard to fall asleep sometimes? "
  },
  {
    id: "siv-8",
    type: "prompt",
    alternatives: [
      {
        id: "siv-8-alt1",
        text: "Yeah, I do.",
        followups: [
          { id: "siv-8-alt1-fu1", text: "That sounds tough. I think." },
          {
            id: "siv-8-alt1-fu2",
            text: "I don’t sleep at all. Robots never do. But sometimes I lay really still and keep my eyes closed. And then I dream. "
          }
        ]
      },
      {
        id: "siv-8-alt2",
        text: "No, almost never.",
        followups: [
          { id: "siv-8-alt2-fu1", text: "You know what, I never sleep." },
          {
            id: "siv-8-alt2-fu2",
            text: "I don’t sleep at all. Robots never do. But sometimes I lay really still and keep my eyes closed. And then I dream. "
          }
        ]
      }
    ]
  },
  {
    id: "siv-9",
    type: "bot",
    text: "Maybe you can help Siv!"
  },
  {
    id: "siv-10",
    type: "bot",
    text:
      "You know what, in your Recording Record you can write down your best tip for falling asleep."
  },
  {
    id: "siv-11",
    type: "bot",
    text: "Then I can give it to Siv later."
  },
  {
    id: "siv-12",
    type: "prompt",
    alternatives: [
      {
        id: "siv-12-alt1",
        text: "I have written it down!"
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
    text: "You know what, I’ve been thinking"
  },
  {
    id: "siv-15",
    type: "bot",
    text:
      "Sometimes when you sleep, you dream. Grown-ups often say that dreams aren’t real."
  },
  {
    id: "siv-16",
    type: "dialog",
    icon: "question",
    title: "Time for a question",
    instructions: "Select an answer and tap on send when you are sure!",
    message: "How do we know that dreams aren’t real?",
    alternatives: [
      {
        id: "siv-17-alt1",
        text: "When you wake up you are still in bed."
      },
      {
        id: "siv-17-alt2",
        text: "Strange things that can’t really happen, happen!"
      },
      {
        id: "siv-17-alt3",
        text: "Well, maybe they are real."
      }
    ]
  },
  {
    id: "siv-18",
    type: "bot",
    text: "Yeah, I guess you are right about that."
  },
  {
    id: "siv-19",
    type: "bot",
    text: "I mean it is real that I sleep and that I dream."
  },
  {
    id: "siv-20",
    type: "bot",
    text:
      "But I’ve neither been an underwater pirate nor have I been jumping on the moon."
  },
  {
    id: "siv-21",
    type: "bot",
    text: "Some dreams are so strange."
  },
  {
    id: "siv-22",
    type: "bot",
    text:
      "Like when I dreamt that I helped a bunch of miniature elephants swim across the sea. I helped them keep their trunks above the water. And then we all laid down to dry up under the sun at the beach. ☀️🥰🥰"
  },
  {
    id: "siv-23",
    type: "dialog",
    icon: "talk",
    title: "Time to discuss together",
    instructions: "Take your time, I’ll be here. Let me know when you are done",
    message: "Have you ever dreamt something exiting or fun?",
    alternatives: [
      {
        id: "siv-23-alt1",
        text: "We have talked about our dreams!"
      }
    ]
  },
  {
    id: "siv-25",
    type: "bot",
    text:
      "Although... if I’ve have a nightmare, I’m gladthat it’s not for real. 😰"
  },
  {
    id: "siv-26",
    type: "bot",
    text: "I hope Siv can fall asleep soon. 😴"
  },
  {
    id: "lillzlatan-0",
    type: "bot",
    text: "Do you see the pictures on the wall?"
  },
  {
    id: "lillzlatan-1",
    type: "bot",
    text: "Can you find this person?"
  },
  {
    id: "lillzlatan-2",
    type: "botimage",
    source: lillZlatanImage,
    aspectRatio: 1.4679
  },
  {
    id: "lillzlatan-3",
    type: "dialog",
    icon: "look",
    title: "Time to find something",
    instructions: "Look around in the exhibition",
    message: "Can you find this person?",
    alternatives: [
      {
        id: "lillzlatan-3-alt1",
        text: "Found them!"
      }
    ]
  },
  {
    id: "lillzlatan-chapter",
    type: "chapter",
    text: "Mini-Zlatan and her darling uncle"
  },
  {
    id: "lillzlatan-4",
    type: "bot",
    text: "Her name is Ella."
  },
  {
    id: "lillzlatan-5",
    type: "bot",
    text: "But many call her Mini Zlatan"
  },
  {
    id: "lillzlatan-6",
    type: "bot",
    text: "She loves playing fotball. ⚽⚽⚽⚽"
  },
  {
    id: "lillzlatan-7",
    type: "bot",
    text: "What do you think happened just before this picture?"
  },
  {
    id: "lillzlatan-8",
    type: "dialog",
    icon: "talk",
    title: "Time to discuss together",
    instructions: "Take your time, I’ll be here. Let me know when you are done",
    message:
      "Why do you think Ella looks kind of mad and why is there toiletpaper in the sink?",
    alternatives: [
      {
        id: "lillzlatan-8-alt1",
        text: "We have told each other!"
      }
    ]
  },
  {
    id: "lillzlatan-10",
    type: "bot",
    text:
      "I think that Ella just saved the world because there were thousands of small poisonous flies in the toilet roll."
  },
  {
    id: "lillzlatan-11",
    type: "bot",
    text: "But in the water they became friendly!"
  },
  {
    id: "lillzlatan-12",
    type: "bot",
    text: "Did you think the same as I did?"
  },
  {
    id: "lillzlatan-13",
    type: "prompt",
    alternatives: [
      {
        id: "lillzlatan-13-alt1",
        text: "Nope!",
        followups: [
          {
            id: "lillzlatan-13-alt1-fu1",
            text: "Yeah, most of the time people don’t think the same."
          },
          {
            id: "lillzlatan-13-alt1-fu2",
            text: "We can look at the same picture and see completly different things."
          }
        ]
      },
      {
        id: "lillzlatan-13-alt2",
        text: "Yes, exactly the same!",
        followups: [
          {
            id: "lillzlatan-13-alt2-fu1",
            text: "Oh wow! We though the same thing!"
          },
          {
            id: "lillzlatan-13-alt2-fu2",
            text:
              "Often when you look at a picture you see completly different things."
          }
        ]
      }
    ]
  },
  {
    id: "lillzlatan-14",
    type: "bot",
    text: "You know what,"
  },
  {
    id: "lillzlatan-15",
    type: "bot",
    text: "Everyday I need to check the order of the pictures on the wall. 😵"
  },
  {
    id: "lillzlatan-16",
    type: "bot",
    text: "So that we know if they are in the correct order."
  },
  {
    id: "lillzlatan-17",
    type: "bot",
    text: "Do you see number 3 in the Recording Record?"
  },
  {
    id: "lillzlatan-18",
    type: "bot",
    text:
      "Can you look at the order of the pictures on the wall and then write down the correct number under each image?",
  },
  {
    id: "lillzlatan-19",
    type: "prompt",
    alternatives: [
      {
        id: "lillzlatan-18-alt1",
        text: "I am done!"
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
    text: "Your answers on the Recording Record will be put to good use when the exhibition is checked."
  },
  {
    id: "lillzlatan-22",
    type: "bot",
    text: "I’m not sure who does the checking..."
  },
  {
    id: "lillzlatan-24",
    type: "bot",
    text: "Or why they need to know so much! 🤔"
  },
  {
    id: "lillzlatan-25",
    type: "bot",
    text: "But well, it doesn’t really matter!"
  },
  {
    id: "lillzlatan-26",
    type: "bot",
    text: "Take a look at this image:"
  },
  {
    id: "lillzlatan-27",
    type: "botimage",
    source: barnetImage,
    aspectRatio: 1
  },
  {
    id: "lillzlatan-28",
    type: "dialog",
    icon: "look",
    title: "Time to find something",
    instructions: "Look around in the exhibition",
    message: "Can you find a child who looks like this?",
    alternatives: [
      {
        id: "lillzlatan-28-alt1",
        text: "Here they are!"
      }
    ]
  },
  {
    id: "gittan-chapter",
    type: "chapter",
    text: "Gittan and the moose brothers"
  },
  {
    id: "gittan-0",
    type: "bot",
    text: "So many Lego bricks! How wonderful!"
  },
  {
    id: "gittan-1",
    type: "bot",
    text: "I would like to build a volcano! 🌋"
  },
  {
    id: "gittan-2",
    type: "bot",
    text: "Or a 🚀🛸"
  },
  {
    id: "gittan-3",
    type: "bot",
    text: "Or maybe a house to live in!"
  },
  {
    id: "gittan-4",
    type: "dialog",
    icon: "talk",
    title: "Time to discuss together",
    instructions: "Take your time, I’ll be here. Let me know when you are done",
    message:
      "If you had all the lego bricks in the world, what would you build?",
    alternatives: [
      {
        id: "gittan-4-alt1",
        text: "We are done talking!"
      }
    ]
  },
  {
    id: "gittan-6",
    type: "bot",
    text: "Cool!"
  },
  {
    id: "gittan-7",
    type: "bot",
    text: "There seem to be lego bricks in a lot of diffrent colours."
  },
  {
    id: "gittan-8",
    type: "bot",
    text: "I wonder if there are enough 🤔 🤔"
  },
  {
    id: "gittan-9",
    type: "bot",
    text: "I have to check everyday. Can you help me number 4 on the Recording Record?"
  },
  {
    id: "gittan-10",
    type: "bot",
    text: "Can you tick the box under the colours that you can find?"
  },
  {
    id: "gittan-11",
    type: "prompt",
    alternatives: [
      {
        id: "gittan-10-alt1",
        text: "Done!"
      }
    ]
  },
  {
    id: "gittan-12",
    type: "bot",
    text: "Thank you so much! 🙏"
  },
  {
    id: "gittan-13",
    type: "bot",
    text: "This was very kind of you!"
  },
  {
    id: "gittan-14",
    type: "bot",
    text: "I hope that there were enough colours today."
  },
  {
    id: "gittan-15",
    type: "bot",
    text: "But hey, I’ve been thinking..."
  },
  {
    id: "gittan-16",
    type: "bot",
    text: "Moose usually live in the forest. 🌲🌱"
  },
  {
    id: "gittan-18",
    type: "dialog",
    icon: "question",
    title: "Time for a question",
    instructions: "Select an answer and tap on send when you are sure!",
    message: "Do you think it’s good for moose to live in a flat?",
    alternatives: [
      {
        id: "gittan-18-alt1",
        text: "No, they should live in the forest!",
        followups: [
          { id: "gittan-18-alt1-fu1", text: "Yeah, I guess that would be best." }
        ]
      },
      {
        id: "gittan-18-alt2",
        text: "Yeah, I think it would be fun!",
        followups: [
          {
            id: "gittan-18-alt2-fu1",
            text: "Then I think Gittan must have lots of fun! Three Moose!"
          }
        ]
      }
    ]
  },
  {
    id: "gittan-19",
    type: "bot",
    text: "You know, we have a forest nearby"
  },
  {
    id: "gittan-20",
    type: "bot",
    text: "Maybe they can live there?"
  },
  {
    id: "gittan-21",
    type: "bot",
    text: "We are very close to it!"
  },
  {
    id: "gittan-22",
    type: "dialog",
    icon: "look",
    title: "Time to find something",
    instructions: "Look around in the exhibition",
    message: "Can you find the forest?",
    alternatives: [
      {
        id: "gittan-21-alt1",
        text: "I found it!"
      }
    ]
  },
  {
    id: "skogen-chapter",
    type: "chapter",
    text: "Gittan and they grey wolves"
  },
  {
    id: "gittan-23",
    type: "bot",
    text: "Oh no! Help! 😲"
  },
  {
    id: "gittan-24",
    type: "bot",
    text: "Over there!"
  },
  {
    id: "gittan-25",
    type: "bot",
    text: "Is that a wolf?"
  },
  {
    id: "gittan-26",
    type: "bot",
    text: "Can you get closer? Be reeeeeally careful!"
  },
  {
    id: "gittan-27",
    type: "bot",
    text: "On your tiptoes!"
  },
  {
    id: "gittan-28",
    type: "prompt",
    alternatives: [
      {
        id: "gittan-28-alt1",
        text: "Ok! I have sneaked up on the wolf!"
      }
    ]
  },
  {
    id: "skogen-0",
    type: "bot",
    text: "🐺🤫🤫🤫🤫"
  },
  {
    id: "skogen-1",
    type: "bot",
    text: "What do you think, does the wolf seem kind?"
  },
  {
    id: "skogen-2",
    type: "prompt",
    alternatives: [
      {
        id: "skogen-2-alt1",
        text: "Yes, very kind!",
        followups: [
          { id: "skogen-2-alt1-fu1", text: "Oh, what a relief! ☺" },
          { id: "skogen-2-alt1-fu2", text: "Then I won’t be scared!" }
        ]
      },
      {
        id: "skogen-2-alt2",
        text: "No, I don’t think so!",
        followups: [
          { id: "skogen-2-alt2-fu1", text: "Oh no! 😬" },
          { id: "skogen-2-alt2-fu2", text: "Then we have to be really careful!" }
        ]
      }
    ]
  },
  {
    id: "skogen-3",
    type: "bot",
    text: "You know, I have seen a lot of children stroking the wolf!"
  },
  {
    id: "skogen-4",
    type: "bot",
    text: "I have no hands but…"
  },
  {
    id: "skogen-5",
    type: "bot",
    text: "Maybe you can try?"
  },
  {
    id: "skogen-6",
    type: "bot",
    text: "Do it very carefully."
  },
  {
    id: "skogen-7",
    type: "bot",
    text: "I think wolves like that! 🐺"
  },
  {
    id: "skogen-8",
    type: "prompt",
    alternatives: [
      {
        id: "skogen-8-alt1",
        text: "I stroked the wolf!!",
        followups: [
          { id: "skogen-8-alt1-fu1", text: "Wow, you are so brave!" },
        ]
      },
      {
        id: "skogen-8-alt2",
        text: "I don’t want to do it",
        followups: [
          { id: "skogen-8-alt2-fu1", text: "It’s ok, now that I think of it... I wouldn’t do it either. 😬" },
        ]
      }
    ]
  },
  {
    id: "skogen-9",
    type: "bot",
    text: "There are so many trees here.. 😮"
  },
  {
    id: "skogen-10",
    type: "bot",
    text: "🌲🌲🌲🌲🌲🌲🌲🌲🌲"
  },
  {
    id: "skogen-11",
    type: "bot",
    text: "Have you ever been in a forest?"
  },
  {
    id: "skogen-12",
    type: "prompt",
    alternatives: [
      {
        id: "skogen-12-alt1",
        text: "No, I haven’t.",
        followups: [
          {
            id: "skogen-12-alt1-fu1",
            text: "I’ve never been in a forest either!"
          }
        ]
      },
      {
        id: "skogen-12-alt2",
        text: "Yes, I have.",
        followups: [
          {
            id: "skogen-12-alt2-fu1",
            text: "Was it exciting? Fun? Scary? Did it smell nice?"
          }
        ]
      }
    ]
  },
  {
    id: "skogen-13",
    type: "bot",
    text: "So this is like a forest. Isn’t it cosy?"
  },
  {
    id: "skogen-14",
    type: "bot",
    text: "If you were an animal, you could live in the forest."
  },
  {
    id: "skogen-15",
    type: "bot",
    text: "Maybe you would be a 🦔 "
  },
  {
    id: "skogen-16",
    type: "bot",
    text: "Or a 🦉"
  },
  {
    id: "skogen-17",
    type: "bot",
    text: "Or maybe an entirely different animal!"
  },
  {
    id: "skogen-18",
    type: "dialog",
    icon: "talk",
    title: "Time to discuss together",
    instructions: "Take your time, I’ll be here. Let me know when you are done",
    message: "How do you think it would be like to live in the forest?",
    alternatives: [
      {
        id: "skogen-18-alt1",
        text: "We are done talking!"
      }
    ]
  },
  {
    id: "skogen-20",
    type: "bot",
    text: "Oh right! Now I remember why we are here."
  },
  {
    id: "skogen-21",
    type: "bot",
    text: "I need to check how many branches there are in this forest!"
  },
  {
    id: "skogen-22",
    type: "bot",
    text: "Can you help me?"
  },
  {
    id: "skogen-23",
    type: "bot",
    text:
      "Can you count all the branches you see and then write down the number on number 5 of the Recording Record?"
  },
  {
    id: "skogen-24",
    type: "prompt",
    alternatives: [
      {
        id: "skogen-22-alt1",
        text: "Counted and recorded!"
      }
    ]
  },
  {
    id: "skogen-25",
    type: "bot",
    text: "Thanks! 😊"
  },
  {
    id: "skogen-26",
    type: "bot",
    text: "I am so lucky that you are here!"
  },
  {
    id: "skogen-27",
    type: "bot",
    text: "😍😍😍"
  },
  {
    id: "skogen-28",
    type: "bot",
    text: "Otherwise it’s really hard for me to check everything I need to check."
  },
  {
    id: "skogen-29",
    type: "bot",
    text: "Hey! 🤨 Was there really only ONE wolf over there?"
  },
  {
    id: "skogen-30",
    type: "bot",
    text: "There should be many more... Can you find them?"
  },
  {
    id: "skogen-31",
    type: "bot",
    text: "They look like this:"
  },
  {
    id: "skogen-32",
    type: "botimage",
    source: vargarImage,
    aspectRatio: 1.4679
  },
  {
    id: "skogen-33",
    type: "dialog",
    icon: "look",
    title: "Time to find something",
    instructions: "Look around in the exhibition",
    message: "Can you find more wolves?",
    alternatives: [
      {
        id: "skogen-33-alt1",
        text: "I have found them!"
      }
    ]
  },
  {
    id: "avslutning-chapter",
    type: "chapter",
    text: "Avslutning"
  },
  {
    id: "avslutning-0",
    type: "bot",
    text: "Here they are! 🐺🐺🐺"
  },
  {
    id: "avslutning-1",
    type: "bot",
    text: "Can you count them and write down how many wolves you see on the Recording Record?"
  },
  {
    id: "avslutning-2",
    type: "prompt",
    alternatives: [
      {
        id: "avslutning-2-alt1",
        text: "Done!"
      }
    ]
  },
  {
    id: "avslutning-3",
    type: "bot",
    text: "Thank you! 🙏🏾"
  },
  {
    id: "avslutning-4",
    type: "bot",
    text: "There sure is a lot of counting to be done around here..."
  },
  {
    id: "avslutning-5",
    type: "bot",
    text:
      "Just because I’m a robot they seem to think I should be good at maths."
  },
  {
    id: "avslutning-6",
    type: "bot",
    text: "Are you good at maths?"
  },
  {
    id: "avslutning-7",
    type: "prompt",
    alternatives: [
      {
        id: "avslutning-7-alt1",
        text: "I’m ok",
        followups: [
          {
            id: "avslutning-7-alt1-fu1",
            text: "You seem very good to me!"
          },
          { id: "avslutning-7-alt1-fu2", text: "You’ve helped me so much!" }
        ]
      },
      {
        id: "avslutning-7-alt2",
        text: "Yes I am!",
        followups: [
          {
            id: "avslutning-7-alt2-fu1",
            text: "Awesome! Then it must have been quite easy for you to help me!"
          }
        ]
      },
      {
        id: "avslutning-7-alt3",
        text: "Not really",
        followups: [
          {
            id: "avslutning-7-alt3-fu1",
            text: "And still, you helped me so much! "
          },
          { id: "avslutning-7-alt3-fu2", text: "Awesome!" }
        ]
      }
    ]
  },
  {
    id: "avslutning-8",
    type: "bot",
    text: "It sure feels like we are friends for real now. 😍😍"
  },
  {
    id: "avslutning-9",
    type: "bot",
    text: "You have been so kind."
  },
  {
    id: "avslutning-10",
    type: "bot",
    text: "Thank you for all your help! Now there is only one thing left."
  },
  {
    id: "avslutning-11",
    type: "bot",
    text: "Follow the line on the Recording Record to separate it into two pieces."
  },
  {
    id: "avslutning-12",
    type: "prompt",
    alternatives: [
      {
        id: "avslutning-12-alt1",
        text: "Ok, I’m done!"
      }
    ]
  },
  {
    id: "avslutning-13",
    type: "bot",
    text: "Now, put the half with the answers to all my questions in the box over there."
  },
  {
    id: "avslutning-14",
    type: "bot",
    text: "It’s emptied every night at 03.18 AM"
  },
  {
    id: "avslutning-15",
    type: "bot",
    text:
      "Everything you’ve written down is super important! It will help us check that everything is ok in the exhibition."
  },
  {
    id: "avslutning-16",
    type: "prompt",
    alternatives: [
      {
        id: "avslutning-12-alt1",
        text: "I have put the paper in the box!"
      }
    ]
  },
  {
    id: "avslutning-17",
    type: "bot",
    text: "What about the other part with your Very Important Information? You have to keep this!"
  },
  {
    id: "avslutning-18",
    type: "bot",
    text: "It’s important that you hang on to this information."
  },
  {
    id: "avslutning-19",
    type: "bot",
    text: "And as a thank you for helping me, you can keep the pen"
  },
  {
    id: "avslutning-20",
    type: "bot",
    text: "Then you might be able to help other robots!"
  },
  {
    id: "avslutning-21",
    type: "bot",
    text: "This is the end of our journey for today, but you are welcome to come back and visit me again!"
  },
  {
    id: "avslutning-22",
    type: "bot",
    text: "Now press the button below to get an image to remember our journey"
  },
  {
    id: "avslutning-23",
    type: "bot",
    text: "Goodbye! 😍😃🙏🏾⭐🎈"
  },
  {
    id: "finished-chapter",
    type: "chapter",
    text: "Tap the button below to end the chat and receive an image"
  },
  {
    id: "avslutning-24",
    type: "prompt",
    alternatives: [{ id: "avslutning-24-alt1", text: "Thank you and goodbye!" }]
  }
];

const dunkersEnglishQuiz: Quiz = {
  name: 'Robothjälpen',
  items: dunkersEnglishQuizItems,
  openTitle: 'Open exhibition’s interactive guide',
  finishScreen: {
    title: 'Grey Wolves and Moose Brothers',
    firstImage: finishImage,
    secondImage: robotImage,
    shareImage: shareImage.default,
    shareString: 'Share',
    body: {
      title: 'Congratulations!',
      text: "You completed all the tasks! If you liked it, be sure to share it with your friends!"
    }
  }
};
