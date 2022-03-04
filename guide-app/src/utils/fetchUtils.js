// @flow

import {
  API_BASE_URL,
  DEPRECATED_API_BASE_URL,
  GROUP_ID,
} from "@data/endpoints";
import { validate } from "./JSONValidator";
import { DateUtils } from "@utils";

async function fetchJSON(
  relativeUrl: string,
  langCode: string,
  params?: ?string
): Promise<any> {
  let url = `${API_BASE_URL}/${relativeUrl}/?lang=${langCode}`;

  if (relativeUrl === "events") {
    url = `${DEPRECATED_API_BASE_URL}/${relativeUrl}/?lang=${langCode}`;
  }
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
  const json = await fetchJSON("guidegroups", langCode || 'sv', params);
  const fetchedGuideGroups: GuideGroup[] = validateData(json, "guideGroup");

  return fetchedGuideGroups;
}

async function getGuides(langCode: string, ids: number[]): Promise<Guide[]> {
  if (ids.length === 0) {
    return [];
  }

  const params = idsToParamString(ids);

  const json = await fetchJSON("guides", langCode || 'sv', params);
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

  const json = await fetchJSON("interactive_guides", langCode || 'sv', params);
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
  const json = await fetchJSON("guides", langCode || 'sv', params);
  const fetchedGuides: Guide[] = validateData(json, "guide");

  return fetchedGuides;
}

export async function getNavigation(
  langCode: string
): Promise<NavigationCategory[]> {
  const params = `&userGroupId=${GROUP_ID}`;
  const json = await fetchJSON("navigations", langCode || 'sv', params);
  const fetchedNavigation: NavigationCategory[] = validateData(
    json,
    "navigationCategory"
  );

  return fetchedNavigation;
}

export async function getEvents(
  langCode: string,
  dateStart: Date,
  dateEnd: Date,
  perPage: any,
  page: any,
): Promise<Event[]> {
  console.log("per page", perPage, "page", page)
  const dateStartFmt = DateUtils.shortDate(dateStart);
  const dateEndFmt = DateUtils.shortDate(dateEnd);
  const params = `&userGroupId=${GROUP_ID}&dateStart=${dateStartFmt}&dateEnd=${dateEndFmt}&perPage=${perPage}&page=${page}`;
  const json = await fetchJSON("events", langCode || 'sv', params);
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
