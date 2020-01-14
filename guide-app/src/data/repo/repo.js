import language from "@src/data/repo/repo.language";

const repos = {
  language
};

const repo = repoName => {
  const fullRepoName = repoName.toLowerCase();

  return repos[fullRepoName]();
};

export default repo;
