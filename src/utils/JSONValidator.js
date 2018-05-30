// @flow

import Ajv from "ajv";

import jsonSchema from "ajv/lib/refs/json-schema-draft-06.json";

const beacon = require("../../json-schemas/beacon.json");
const contentObject = require("../../json-schemas/contentObject.json");
const guide = require("../../json-schemas/guide.json");
const guideGroup = require("../../json-schemas/guideGroup.json");
const link = require("../../json-schemas/link.json");
const location = require("../../json-schemas/location.json");
const mediaContent = require("../../json-schemas/mediaContent.json");
const pointProperty = require("../../json-schemas/pointProperty.json");
const position = require("../../json-schemas/position.json");

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
