// @flow
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const PI2 = 2 * Math.PI;

const clamp = (value: number, { min, max }: { min: number, max: number }) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }

  return value;
};

const limitPrecision = (value: number, precision: number) => {
  const exp = 10 ** precision;
  return Math.round(value * exp) / exp;
};

const getAverage = (array: Array<number>) => array.reduce((accumulator, value) => accumulator + value, 0) / array.length;

const exceedsThreshold = (a: number, b: number, c: number) => Math.abs(a - b) >= c;

export default {
  DEG_TO_RAD,
  RAD_TO_DEG,
  PI2,
  clamp,
  limitPrecision,
  getAverage,
  exceedsThreshold,
};
