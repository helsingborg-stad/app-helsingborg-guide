import { _LANGUAGE_API_URL } from "@data/endpoints";

module.exports = () => {
  function getAvailableLanguages() {
    return fetch(_LANGUAGE_API_URL)
      .then(response => response.json())
      .then(language => language);
  }

  return {
    getAvailableLanguages
  };
};
