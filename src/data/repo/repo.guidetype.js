import { _API_BASE } from "./endpoints";

export default {
  getGuideTypes() {
    return fetch(`${_API_BASE}/guidetype}`)
      .then(response => response.json())
      .then(guides => guides);
  },
};
