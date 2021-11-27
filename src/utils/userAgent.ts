import { UAParser } from "ua-parser-js";

let ua = "";
try {
  ua = window.navigator.userAgent;
} catch (e) {}
const parser = new UAParser(ua);
const { type } = parser.getDevice();

export const userAgent = parser.getResult();

export const isMobile = type === "mobile" || type === "tablet";
