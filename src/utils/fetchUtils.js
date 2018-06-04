// @flow

import { API_BASE_URL } from "../data/repo/endpoints";
import { validate } from "./JSONValidator";

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
  const url = `${API_BASE_URL}/guidegroup/?lang=${langCode}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch guide groups");
  }

  const json = await response.json();
  const fetchedGuideGroups: GuideGroup[] = validateData(json, "guideGroup");

  return fetchedGuideGroups;
}

async function getGuides(langCode: string): Promise<Guide[]> {
  const url = `${API_BASE_URL}/guide/?lang=${langCode}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch guides");
  }

  const json = await response.json();
  const fetchedGuides: Guide[] = validateData(json, "guide");

  return fetchedGuides;
}

export default { getGuideGroups, getGuides };
