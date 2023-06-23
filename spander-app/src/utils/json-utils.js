export const jsonToObj = (val) => {
  try {
    return JSON.parse(val);
  } catch (err) {
    return val;
  }
};
export const objToJson = (val) => {
  if (typeof val == "string") {
    return val;
  }
  try {
    return JSON.stringify(val);
  } catch (err) {
    return val;
  }
};
