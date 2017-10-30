import { _API_BASE } from "./endpoints";

module.exports = () => {
  function getById(id) {
    return fetch(`${_API_BASE}events/${id}`)
      .then(response => response.json())
      .then(event => event)
      .catch(error => error);
  }

  return {
    getById,
  };
};
