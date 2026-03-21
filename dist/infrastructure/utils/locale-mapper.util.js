"use strict";
/**
 * Locale Mapper Utilities
 * @description Maps locale codes to Google Translate language codes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleTranslateLang = getGoogleTranslateLang;
exports.isEnglishVariant = isEnglishVariant;
exports.getLocaleDisplayName = getLocaleDisplayName;
const locale_mapping_constants_1 = require("../constants/locale-mapping.constants");
/**
 * Get Google Translate language code from locale
 * @param locale - Locale code (e.g., 'tr-TR', 'de-DE')
 * @returns Google Translate language code (e.g., 'tr', 'de')
 */
function getGoogleTranslateLang(locale) {
    return locale_mapping_constants_1.GOOGLE_TRANSLATE_LANG_MAP[locale] ?? locale.split("-")[0];
}
/**
 * Check if locale is an English variant
 * @param locale - Locale code
 * @returns True if locale is an English variant
 */
function isEnglishVariant(locale) {
    const langCode = getGoogleTranslateLang(locale);
    return langCode === "en";
}
/**
 * Get display name for locale
 * @param locale - Locale code
 * @returns Display name
 */
function getLocaleDisplayName(locale) {
    const displayNames = {
        "ar-SA": "Arabic (Saudi Arabia)",
        "bg-BG": "Bulgarian",
        "cs-CZ": "Czech",
        "da-DK": "Danish",
        "de-DE": "German",
        "el-GR": "Greek",
        "en-AU": "English (Australia)",
        "en-CA": "English (Canada)",
        "en-GB": "English (UK)",
        "en-US": "English (US)",
        "es-ES": "Spanish (Spain)",
        "es-MX": "Spanish (Mexico)",
        "fi-FI": "Finnish",
        "fr-CA": "French (Canada)",
        "fr-FR": "French (France)",
        "hi-IN": "Hindi",
        "hr-HR": "Croatian",
        "hu-HU": "Hungarian",
        "id-ID": "Indonesian",
        "it-IT": "Italian",
        "ja-JP": "Japanese",
        "ko-KR": "Korean",
        "ms-MY": "Malay",
        "nl-NL": "Dutch",
        "no-NO": "Norwegian",
        "pl-PL": "Polish",
        "pt-BR": "Portuguese (Brazil)",
        "pt-PT": "Portuguese (Portugal)",
        "ro-RO": "Romanian",
        "ru-RU": "Russian",
        "sk-SK": "Slovak",
        "sl-SI": "Slovenian",
        "sv-SE": "Swedish",
        "th-TH": "Thai",
        "tl-PH": "Tagalog",
        "tr-TR": "Turkish",
        "uk-UA": "Ukrainian",
        "vi-VN": "Vietnamese",
        "zh-CN": "Chinese (Simplified)",
        "zh-TW": "Chinese (Traditional)",
    };
    return displayNames[locale] || locale;
}
