const fs = require("fs");

if (process.argv.length < 3) { // 0: process, 1: input, 2: output
  return console.error(
    "Please pass a .tsv translations file and an output file e.g.:\nnpm run translate GuideHelsingborgTranslations.tsv ./src/languages/strings.js",
  );
}

const INPUT_PATH = process.argv[2];
const OUTPUT_PATH = process.argv[3];
const SEPARATOR = "\t";
const ENCODING = "utf8";
const STRIP_REGEX = /[\r]/gi;

const indent = (strings, depth) => {
  for (let i = 0; i < (2 * depth); i += 1) {
    strings.push(" ");
  }
};

const printObject = (object, strings, depth = 0) => {
  const entries = Object.entries(object);

  entries.forEach(([key, value]) => {
    indent(strings, depth);
    strings.push(key.replace(STRIP_REGEX, "").trim());
    strings.push(": ");
    if (typeof value === "object") {
      strings.push("{\n");
      printObject(value, strings, depth + 1);
      indent(strings, depth);
      strings.push("},\n");
    } else {
      strings.push("\"");
      strings.push(value.replace(STRIP_REGEX, "").replace(/"/gi, "\\\""));
      strings.push("\",\n");
    }
  });
};

const printHeader = () => [
  "/**\n",
  " * Created at ", new Date().toString(), "\n",
  " */\n",
  "\n",
].join("");

const printContent = (output) => {
  const outputStrings = [];
  printObject(output, outputStrings, 1);
  return outputStrings.join("");
};

const readFile = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, ENCODING, (error, contents) => {
    if (error) return reject(error);

    const lines = contents.split("\n");
    const headers = lines[0].split(SEPARATOR);

    const object = lines.slice(1).reduce((output, line) => {
      const translations = line.split(SEPARATOR);
      const key = translations[0];

      translations.forEach((translation, index) => {
        if (index > 0) {
          const header = headers[index];
          if (!output[header]) output[header] = {};
          output[header][key] = translation;
        }
      });

      return output;
    }, {});

    const data = [
      printHeader(),
      "export default {\n",
      printContent(object),
      "};\n",
    ].join("");

    return resolve(data);
  });
});

const writeFile = (filename, data) => new Promise((resolve, reject) => {
  fs.writeFile(filename, data, error => (error ? reject(error) : resolve("Success!")));
});

(async function translate() {
  const data = await readFile(INPUT_PATH).catch(console.error);
  const result = await writeFile(OUTPUT_PATH, data).catch(console.error);
  console.log(result);
}());
