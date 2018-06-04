// @flow

import { API_BASE_URL } from "../data/repo/endpoints";
import { validate } from "./JSONValidator";

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
  const fetchedGuides: Guide[] = [];

  json.forEach((element: any) => {
    try {
      if (validate(element, "guide")) {
        fetchedGuides.push(element);
      }
    } catch (err) {
      console.warn("Validation failed for fetched guide.", err);
    }
  });

  return fetchedGuides;
}

export default { getGuideGroups, getGuides };
