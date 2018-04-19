// @flow

import { API_BASE_URL } from "../data/repo/endpoints";

async function getGuideGroups(langCode: string): Promise<GuideGroup[]> {
  const url = `${API_BASE_URL}/guidegroup/?lang=${langCode}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch guide groups");
  }

  const json = await response.json();
  // TODO validate data

  return json;
}

async function getGuides(langCode: string): Promise<Guide[]> {
  const url = `${API_BASE_URL}/guide/?lang=${langCode}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch guides");
  }

  const json = await response.json();
  // TODO validate data

  return json;
}

export default { getGuideGroups, getGuides };
