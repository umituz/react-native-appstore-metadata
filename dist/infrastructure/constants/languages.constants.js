"use strict";
/**
 * Supported Languages Constants
 * @description List of supported locales for app store metadata translation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_LOCALES = exports.APPSTORE_SUPPORTED_LOCALES = exports.getLanguageDisplayName = exports.LANGUAGE_NAMES = exports.LANGUAGE_MAP = void 0;
// Import from google-translate package for consistency
var react_native_google_translate_1 = require("@umituz/react-native-google-translate");
Object.defineProperty(exports, "LANGUAGE_MAP", { enumerable: true, get: function () { return react_native_google_translate_1.LANGUAGE_MAP; } });
Object.defineProperty(exports, "LANGUAGE_NAMES", { enumerable: true, get: function () { return react_native_google_translate_1.LANGUAGE_NAMES; } });
Object.defineProperty(exports, "getLanguageDisplayName", { enumerable: true, get: function () { return react_native_google_translate_1.getLanguageDisplayName; } });
/**
 * App Store Connect supported locales
 * @description Only these locales are supported by App Store Connect
 * Other locales will be automatically skipped during translation
 */
exports.APPSTORE_SUPPORTED_LOCALES = [
    "ar-SA",
    "ca",
    "cs",
    "da",
    "de-DE",
    "el",
    "en-AU",
    "en-CA",
    "en-GB",
    "en-US",
    "es-ES",
    "es-MX",
    "fi",
    "fr-CA",
    "fr-FR",
    "he",
    "hi",
    "hr",
    "hu",
    "id",
    "it",
    "ja",
    "ko",
    "ms",
    "nl-NL",
    "no",
    "pl",
    "pt-BR",
    "pt-PT",
    "ro",
    "ru",
    "sk",
    "sv",
    "th",
    "tr",
    "uk",
    "vi",
    "zh-Hans",
    "zh-Hant",
];
exports.SUPPORTED_LOCALES = [
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
];
