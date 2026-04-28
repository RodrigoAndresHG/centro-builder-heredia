const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";

type CloudflareEnvelope<T> = {
  success: boolean;
  result?: T;
  errors?: Array<{ message?: string }>;
};

type DirectUploadResult = {
  uid: string;
  uploadURL: string;
};

type StreamVideoResult = {
  uid: string;
  readyToStream?: boolean;
  duration?: number;
  thumbnail?: string;
  status?: {
    state?: string;
  };
};

function getCloudflareConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_TOKEN;

  if (!accountId || !token) {
    throw new Error("Cloudflare Stream no está configurado.");
  }

  return { accountId, token };
}

function getCloudflareError(errors?: Array<{ message?: string }>) {
  return errors?.map((error) => error.message).filter(Boolean).join(" ") ??
    "Cloudflare Stream no respondió correctamente.";
}

export function getCloudflareStreamPlaybackUrl(streamVideoId: string) {
  return `https://iframe.videodelivery.net/${streamVideoId}`;
}

export function getStreamRequireSignedUrls() {
  return process.env.CLOUDFLARE_STREAM_REQUIRE_SIGNED_URLS === "true";
}

export function normalizeStreamVideoStatus(video?: StreamVideoResult | null) {
  if (!video) {
    return "UPLOADING";
  }

  if (video.readyToStream) {
    return "READY";
  }

  return video.status?.state?.toUpperCase() ?? "PROCESSING";
}

export async function createCloudflareStreamDirectUpload({
  lessonId,
  title,
}: {
  lessonId: string;
  title: string;
}) {
  const { accountId, token } = getCloudflareConfig();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const response = await fetch(
    `${CLOUDFLARE_API_BASE}/accounts/${accountId}/stream/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        maxDurationSeconds: 7200,
        expiry: expiresAt,
        requireSignedURLs: getStreamRequireSignedUrls(),
        meta: {
          lessonId,
          title,
          source: "builder-heredia-admin",
        },
      }),
    },
  );
  const data =
    (await response.json().catch(() => null)) as CloudflareEnvelope<DirectUploadResult> | null;

  if (!response.ok || !data?.success || !data.result) {
    throw new Error(getCloudflareError(data?.errors));
  }

  return data.result;
}

export async function getCloudflareStreamVideo(streamVideoId: string) {
  const { accountId, token } = getCloudflareConfig();
  const response = await fetch(
    `${CLOUDFLARE_API_BASE}/accounts/${accountId}/stream/${streamVideoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );
  const data =
    (await response.json().catch(() => null)) as CloudflareEnvelope<StreamVideoResult> | null;

  if (!response.ok || !data?.success) {
    throw new Error(getCloudflareError(data?.errors));
  }

  return data.result ?? null;
}
