export async function verifyTurnstile(
  token: string,
  secret: string,
  hostname: string,
): Promise<boolean> {
  const form = new URLSearchParams({ secret, response: token });
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form, signal: AbortSignal.timeout(5_000) },
  );

  if (!response.ok) return false;

  const result = (await response.json()) as {
    success?: boolean;
    hostname?: string;
  };
  return result.success === true && result.hostname === hostname;
}
