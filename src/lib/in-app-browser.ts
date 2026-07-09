// Detección del navegador interno (WebView) de TikTok. Su WebView rompe con
// videos autoplay inline: los toma en pantalla completa o congela la página
// (a diferencia de Instagram/Facebook, que sí los manejan). Cuando lo
// detectamos, servimos una imagen de póster en vez del video.
//
// Cubre TikTok en iOS (musical_ly + BytedanceWebview), Android
// (com.zhiliaoapp.musically → "musically", TTWebView) y variantes regionales
// (Trill). Función pura → testeable.
export function isTikTokInAppBrowser(userAgent: string): boolean {
  if (!userAgent) {
    return false;
  }

  return /tiktok|trill|musical_ly|musically|bytedance|ttwebview/i.test(
    userAgent,
  );
}
