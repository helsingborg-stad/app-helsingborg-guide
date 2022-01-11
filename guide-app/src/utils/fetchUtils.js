// @flow

import {
  API_BASE_URL,
  DEPRECATED_API_BASE_URL,
  GROUP_ID,
} from "@data/endpoints";
import { validate } from "./JSONValidator";
import { DateUtils } from "@utils";

console.log("le url", API_BASE_URL, "url2", DEPRECATED_API_BASE_URL)
async function fetchJSON(
  relativeUrl: string,
  langCode: string,
  params?: ?string
): Promise<any> {
  let url = `${API_BASE_URL}/${relativeUrl}/?lang=${langCode}`;

  console.log("url", url, "relative", relativeUrl)
  if (relativeUrl === "events") {
    url = `${DEPRECATED_API_BASE_URL}/${relativeUrl}/?lang=${langCode}`;
  }

  if (params) {
    url += params;
  }

  console.log("FULL", url += params)

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
      console.warn(
        `Validation failed for fetched ${scheme}`,
        JSON.stringify(err, null, 2)
      );
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
  const json = await fetchJSON("guidegroups", langCode, params);
  const fetchedGuideGroups: GuideGroup[] = validateData(json, "guideGroup");

  return fetchedGuideGroups;
}

async function getGuides(langCode: string, ids: number[]): Promise<Guide[]> {
  if (ids.length === 0) {
    return [];
  }

  const params = idsToParamString(ids);

  const json = await fetchJSON("guides", langCode, params);
  const fetchedGuides: Guide[] = validateData(json, "guide");

  return fetchedGuides;
}

async function getInteractiveGuides(
  langCode: string,
  ids: number[]
): Promise<InteractiveGuide[]> {
  if (ids.length === 0) {
    return [];
  }

  const params = idsToParamString(ids);

  const json = await fetchJSON("interactive_guides", langCode, params);
  const fetchedGuides: InteractiveGuide[] = validateData(
    json,
    "interactiveGuide"
  );

  return fetchedGuides;
}

async function getGuidesForGuideGroup(
  langCode: string,
  guideGroupId: number
): Promise<Guide[]> {
  const params = `&guideGroupId=${guideGroupId}`;
  const json = await fetchJSON("guides", langCode, params);
  const fetchedGuides: Guide[] = validateData(json, "guide");

  return fetchedGuides;
}

export async function getNavigation(
  langCode: string
): Promise<NavigationCategory[]> {
  const params = `&userGroupId=${GROUP_ID}`;
  const json = await fetchJSON("navigations", langCode, params);
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
  const dateStartFmt = DateUtils.shortDate(dateStart);
  const dateEndFmt = DateUtils.shortDate(dateEnd);
  const params = `&userGroupId=${GROUP_ID}&dateStart=${dateStartFmt}&dateEnd=${dateEndFmt}`;
  const json = await fetchJSON("events", langCode, params);
  const fetchedEvents: Event[] = validateData(json, "event");

  return fetchedEvents;
}

export default {
  getEvents,
  getGuideGroups,
  getGuides,
  getInteractiveGuides,
  getGuidesForGuideGroup,
  getNavigation,
};