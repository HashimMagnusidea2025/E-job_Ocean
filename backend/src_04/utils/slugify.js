// utils/slugify.js
export const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")      // space -> -
    .replace(/[^\w-]+/g, "")   // remove invalid chars
    .replace(/--+/g, "-");     // multiple - -> single
