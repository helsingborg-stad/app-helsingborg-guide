import { _LANGUAGE_API_URL } from "./endpoints";

module.exports = () => {
  function getAvailableLanguages() {
    return fetch(_LANGUAGE_API_URL)
      .then(response => response.json())
      .then((language) => {
        if (language && language.code !== "rest_no_route") return language;
        return null;
      });
  }

  return {
    getAvailableLanguages,
  };
};
