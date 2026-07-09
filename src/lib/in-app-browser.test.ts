import { describe, expect, it } from "vitest";

import { isTikTokInAppBrowser } from "./in-app-browser";

// UAs reales (recortados) de los WebViews internos.
const TIKTOK_IOS =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_2023 JsSdk/2.0 NetType/WIFI BytedanceWebview/d8a21c6";
const TIKTOK_ANDROID =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116 Mobile Safari/537.36 trill_320 com.zhiliaoapp.musically TTWebView/1130220";
const INSTAGRAM =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Instagram 300.0.0.0 (iPhone14,3; iOS 16_6)";
const FACEBOOK =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 [FBAN/FBIOS;FBAV/430.0]";
const CHROME =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116 Mobile Safari/537.36";

describe("isTikTokInAppBrowser", () => {
  it("detecta el WebView de TikTok en iOS", () => {
    expect(isTikTokInAppBrowser(TIKTOK_IOS)).toBe(true);
  });

  it("detecta el WebView de TikTok en Android", () => {
    expect(isTikTokInAppBrowser(TIKTOK_ANDROID)).toBe(true);
  });

  it("NO marca Instagram (su WebView sí soporta el video)", () => {
    expect(isTikTokInAppBrowser(INSTAGRAM)).toBe(false);
  });

  it("NO marca Facebook", () => {
    expect(isTikTokInAppBrowser(FACEBOOK)).toBe(false);
  });

  it("NO marca un navegador normal (Chrome)", () => {
    expect(isTikTokInAppBrowser(CHROME)).toBe(false);
  });

  it("no explota con userAgent vacío", () => {
    expect(isTikTokInAppBrowser("")).toBe(false);
  });
});
