import guide from "./repo.guide";
import language from "./repo.language";

const repos = {
  guide,
  language,
};

const repo = (repoName) => {
  const fullRepoName = repoName.toLowerCase();

  return repos[fullRepoName]();
};

export default repo;
