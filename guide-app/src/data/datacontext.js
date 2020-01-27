import repo from "@src/data/repo/repo";

const datacontext = () => {
  const repoNames = ["guide", "language"];

  const service = {};

  function defineLazyLoadedRepos() {
    repoNames.forEach(name => {
      Object.defineProperty(service, name, {
        configurable: true,
        get() {
          const thisRepo = repo(name);
          Object.defineProperty(service, name, {
            value: thisRepo,
            configurable: false,
            enumerable: true
          });
          return thisRepo;
        }
      });
    });
  }

  defineLazyLoadedRepos();

  return service;
};

export default datacontext;
