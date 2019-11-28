import language from "./repo.language";

const repos = {
  language
};

const repo = repoName => {
  const fullRepoName = repoName.toLowerCase();

  return repos[fullRepoName]();
};

export default repo;
