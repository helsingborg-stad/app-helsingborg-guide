// @flow

import { API_BASE_URL } from "../data/repo/endpoints";
import { validate } from "./JSONValidator";

async function fetchJSON(relativeUrl: string, langCode: string): Promise<any> {
  const url = `${API_BASE_URL}/${relativeUrl}/?lang=${langCode}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${relativeUrl}`);
  }

  return response.json();
}

function validateData(data: any, scheme: string): any[] {
  const validatedData: any[] = [];

  data.forEach((element: any) => {
    try {
      if (validate(element, scheme)) {
        validatedData.push(element);
      }
    } catch (err) {
      console.warn("Validation failed for fetched ", scheme, err);
    }
  });

  return validatedData;
}

async function getGuideGroups(langCode: string): Promise<GuideGroup[]> {
  const json = await fetchJSON("guidegroup", langCode);
  const fetchedGuideGroups: GuideGroup[] = validateData(json, "guideGroup");

  return fetchedGuideGroups;
}

async function getGuides(langCode: string): Promise<Guide[]> {
  const json = await fetchJSON("guide", langCode);
  const fetchedGuides: Guide[] = validateData(json, "guide");

  return fetchedGuides;
}

export async function getNavigation(langCode: string): Promise<NavigationCategory[]> {
  const url = `${API_BASE_URL}/navigation/?lang=${langCode}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch navigation");
  }

  const json = await response.json();
  // TODO validate data

  return json;
}

export default {
  getGuideGroups,
  getGuides,
  getNavigation,
};
