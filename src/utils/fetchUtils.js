import { API_BASE_URL } from "../data/repo/endpoints";

async function getGuideGroups(langCode) {
  const url = `${API_BASE_URL}/guidegroup/?lang=${langCode}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch guide groups");
  }

  const json = await response.json();

  return json;
}


export default { getGuideGroups };
