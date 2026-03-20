/**
 * Translation Utilities
 * @description Handles translation API calls with rate limiting
 * Adapted from react-native-settings localization package
 */

interface Response {
  ok: boolean;
  json(): Promise<unknown>;
}

declare const setTimeout: (callback: () => void, ms: number) => number;
declare const fetch: (input: string) => Promise<Response>;

const RATE_LIMIT_DELAY_MS = 100;

function extractTranslationFromResponse(data: unknown): string | null {
  if (!Array.isArray(data)) return null;
  const firstLevel = data[0];
  if (!Array.isArray(firstLevel)) return null;
  const secondLevel = firstLevel[0];
  if (!Array.isArray(secondLevel)) return null;
  const translatedText = secondLevel[0];
  return typeof translatedText === "string" ? translatedText : null;
}

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (!text) return text;

  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  if (timeSinceLastCall < RATE_LIMIT_DELAY_MS) {
    const waitTime = RATE_LIMIT_DELAY_MS - timeSinceLastCall;
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), waitTime);
    });
  }
  lastCallTime = now;

  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`;

    const response = await fetch(url);
    if (!response.ok) return text;

    const data = await response.json();
    const translated = extractTranslationFromResponse(data);
    return translated ?? text;
  } catch {
    return text;
  }
}

let lastCallTime = Date.now();
