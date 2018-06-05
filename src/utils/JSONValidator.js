// @flow

import Ajv from "ajv";

import jsonSchema from "ajv/lib/refs/json-schema-draft-06.json";

const beacon = require("../../json-schemas/IBeacon.json");
const contentObject = require("../../json-schemas/IContentObject.json");
const guide = require("../../json-schemas/IGuide.json");
const guideGroup = require("../../json-schemas/IGuideGroup.json");
const link = require("../../json-schemas/ILink.json");
const location = require("../../json-schemas/ILocation.json");
const mediaContent = require("../../json-schemas/IMediaContent.json");
const navigationCategory = require("../../json-schemas/INavigationCategory.json");
const navigationItem = require("../../json-schemas/INavigationItem.json");
const pointProperty = require("../../json-schemas/IPointProperty.json");
const position = require("../../json-schemas/IPosition.json");

const options = { verbose: true };
const ajv = Ajv(options);

ajv.addMetaSchema(jsonSchema);

// Add schemas
ajv.addSchema(guideGroup, "guideGroup");
ajv.addSchema(pointProperty, "pointProperty");
ajv.addSchema(guide, "guide");
ajv.addSchema(mediaContent, "mediaContent");
ajv.addSchema(contentObject, "contentObject");
ajv.addSchema(link, "link");
ajv.addSchema(beacon, "beacon");
ajv.addSchema(position, "position");
ajv.addSchema(location, "location");
ajv.addSchema(navigationCategory, "navigationCategory");
ajv.addSchema(navigationItem, "navigationItem");

export function validate(data: any, schema: string): boolean {
  const result = ajv.validate(schema, data);
  if (typeof result === "boolean") {
    if (!result) {
      throw ajv.errors;
    }
    return result;
  }
  return false;
}

export default { validate };
