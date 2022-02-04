import { LANGUAGE_API_URL } from "@data/endpoints"


module.exports = () => {
  function getAvailableLanguages() {
    console.log("render state available languages", LANGUAGE_API_URL)
    return fetch(LANGUAGE_API_URL)
      .then(response => response.json())
      .then(language => language);
  }

  return {
    getAvailableLanguages
  };
};
