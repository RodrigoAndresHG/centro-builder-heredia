// WhatsApp Channel link. Public by design (it's meant to be shared).
// Override with NEXT_PUBLIC_COMMUNITY_URL in the environment if the
// channel link is ever changed, otherwise this default is used.
const DEFAULT_COMMUNITY_URL =
  "https://whatsapp.com/channel/0029VbD3AGkLikg5aJbgRq0l";

export function getCommunityUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_COMMUNITY_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_COMMUNITY_URL;
}
