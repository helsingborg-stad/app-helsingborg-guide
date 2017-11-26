import { _API_BASE } from "./endpoints";

export default () => {
  function getGuideTypes(langCode) {
    return fetch(`${_API_BASE}/guidetype?lang=${langCode}`)
      .then(response => response.json())
      .then(guideTypes => guideTypes);
  }

  return { getGuideTypes };
};
