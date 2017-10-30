import repo from "./repo/repo.js";

const datacontext = () => {
  // const req = require.context("./repo", false, /^\.\/.*\.js$/);

  const repoNames = ["guide", "language"];

  const service = {};

  defineLazyLoadedRepos();

  return service;

  function defineLazyLoadedRepos() {
    repoNames.forEach((name) => {
      Object.defineProperty(service, name, {
        configurable: true,
        get() {
          const thisRepo = repo(name);
          Object.defineProperty(service, name, {
            value: thisRepo,
            configurable: false,
            enumerable: true,
          });
          return thisRepo;
        },
      });
    });
  }
};

export default datacontext;
