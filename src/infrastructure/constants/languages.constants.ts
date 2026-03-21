/**
 * Supported Languages Constants
 * @description List of supported locales for app store metadata translation
 */

// Import from google-translate package for consistency
export {
  LANGUAGE_MAP,
  LANGUAGE_NAMES,
  getLanguageDisplayName,
} from '@umituz/react-native-google-translate';

export const SUPPORTED_LOCALES = [
  "ar-SA",
  "bg-BG",
  "cs-CZ",
  "da-DK",
  "de-DE",
  "el-GR",
  "en-AU",
  "en-CA",
  "en-GB",
  "es-ES",
  "es-MX",
  "fi-FI",
  "fr-CA",
  "fr-FR",
  "hi-IN",
  "hr-HR",
  "hu-HU",
  "id-ID",
  "it-IT",
  "ja-JP",
  "ko-KR",
  "ms-MY",
  "nl-NL",
  "no-NO",
  "pl-PL",
  "pt-BR",
  "pt-PT",
  "ro-RO",
  "ru-RU",
  "sk-SK",
  "sl-SI",
  "sv-SE",
  "th-TH",
  "tl-PH",
  "tr-TR",
  "uk-UA",
  "vi-VN",
  "zh-CN",
  "zh-TW",
] as const;
