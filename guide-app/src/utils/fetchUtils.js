// @flow

import { API_BASE_URL, GROUP_ID } from "@data/endpoints";
import { validate } from "./JSONValidator";

async function fetchJSON(
  relativeUrl: string,
  langCode: string,
  params?: ?string
): Promise<any> {
  let url = `${API_BASE_URL}/${relativeUrl}/?lang=${langCode}`;
  if (params) {
    url += params;
  }

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
function idsToParamString(ids: number[]): ?string {
  if (ids.length === 0) {
    return null;
  }

  let params = "&include=";
  params += ids.reduce((sum, id, index) => {
    if (index === 0) {
      return id;
    }

    return `${sum},${id}`;
  }, "");
  return params;
}

async function getGuideGroups(
  langCode: string,
  ids: number[]
): Promise<GuideGroup[]> {
  if (ids.length === 0) {
    return [];
  }

  const params = idsToParamString(ids);
  const json = await fetchJSON("guidegroup", langCode, params);
  const fetchedGuideGroups: GuideGroup[] = validateData(json, "guideGroup");

  return fetchedGuideGroups;
}

async function getGuides(langCode: string, ids: number[]): Promise<Guide[]> {
  if (ids.length === 0) {
    return [];
  }

  const params = idsToParamString(ids);

  const json = await fetchJSON("guide", langCode, params);
  const fetchedGuides: Guide[] = validateData(json, "guide");

  return fetchedGuides;
}

async function getGuidesForGuideGroup(
  langCode: string,
  guideGroupId: number
): Promise<Guide[]> {
  const params = `&guideGroupId=${guideGroupId}`;
  const json = await fetchJSON("guide", langCode, params);
  const fetchedGuides: Guide[] = validateData(json, "guide");

  return fetchedGuides;
}

export async function getNavigation(
  langCode: string
): Promise<NavigationCategory[]> {
  const params = `&userGroupId=${GROUP_ID}`;
  const json = await fetchJSON("navigation", langCode, params);
  const fetchedNavigation: NavigationCategory[] = validateData(
    json,
    "navigationCategory"
  );

  return fetchedNavigation;
}

export async function getEvents(
  langCode: string,
  dateStart: Date,
  dateEnd: Date
): Promise<Event[]> {
  // TODO: use date-fns or similar
  const dateStartFmt = new Date(dateStart).toISOString().substring(0, 10);
  const dateEndFmt = new Date(dateEnd).toISOString().substring(0, 10);
  const params = `&userGroupId=${GROUP_ID}&dateStart=${dateStartFmt}&dateEnd=${dateEndFmt}`;
  const json = await fetchJSON("events", langCode, params);
  const fetchedEvents: Event[] = validateData(json, "event");

  return fetchedEvents;
}

export default {
  getEvents,
  getGuideGroups,
  getGuides,
  getGuidesForGuideGroup,
  getNavigation
};
