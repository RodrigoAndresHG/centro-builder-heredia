import Script from "next/script";

/**
 * Microsoft Clarity tracking. No-ops if NEXT_PUBLIC_CLARITY_PROJECT_ID
 * is not set, so local dev (and any environment without the env var)
 * stays clean of Clarity traffic.
 *
 * Clarity is cookie-based session analytics with session recordings
 * and heatmaps. Free, no event cap.
 */
export function ClarityAnalytics() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
    >
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  );
}
