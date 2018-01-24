import { _API_BASE } from "./endpoints";

module.exports = () => {
  function getAllGroups(langCode) {
    const url = `${_API_BASE}/guidegroup?_embed&lang=${langCode}`;
    return fetch(url)
      .then(response => response.json())
      .then(guides => guides)
      .catch(error =>
        // console.log(error, 'An error in fetching the guides', error);
        error,
      );
  }

  function getGroupById(id) {
    return fetch(`${_API_BASE}/guidegroup/${id}`)
      .then(response => response.json())
      .then(guide => guide)
      .catch(error => error);
  }

  function getGuidesByParent(id) {
    return fetch(`${_API_BASE}/guide/?guidegroup=${id}`)
      .then(response => response.json())
      .then(guides => guides)
      .catch(error =>
        // console.log(error, 'An error in fetching the guides', error);
        error,
      );
  }

  function getAllGuides(langCode) {
    return fetch(`${_API_BASE}/guide?_embed&lang=${langCode}`)
      .then(response => response.json())
      .then(guides => guides)
      .catch(error => error);
  }

  function fetchNavigation(langCode) {
    return fetch(`${_API_BASE}/navigation?lang=${langCode}`)
      .then(response => response.json())
      .then(navItems => navItems);
  }

  return {
    getAllGroups,
    getGroupById,
    getGuidesByParent,
    getAllGuides,
    fetchNavigation,
  };
};
