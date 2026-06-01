// WhatsApp Community invite link. Public by design (it's an invite link
// meant to be shared). Override with NEXT_PUBLIC_COMMUNITY_URL in the
// environment if the community link is ever rotated, otherwise this
// default is used.
const DEFAULT_COMMUNITY_URL =
  "https://chat.whatsapp.com/IdWV38L3Lw6DvP2LzHsNMj?mode=gi_t";

export function getCommunityUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_COMMUNITY_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_COMMUNITY_URL;
}
