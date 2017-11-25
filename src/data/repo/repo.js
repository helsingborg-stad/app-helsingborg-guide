import guide from "./repo.guide";
import language from "./repo.language";
import guidetype from "./repo.guidetype";

const repos = {
  guide,
  guidetype,
  language,
};

const repo = (repoName) => {
  const fullRepoName = repoName.toLowerCase();

  return repos[fullRepoName]();
};

export default repo;
