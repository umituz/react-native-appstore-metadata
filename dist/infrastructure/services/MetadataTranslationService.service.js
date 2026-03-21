"use strict";
/**
 * Metadata Translation Service
 * @description Service for translating app store metadata using @umituz/react-native-google-translate
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataTranslationService = exports.MetadataTranslationService = void 0;
const react_native_google_translate_1 = require("@umituz/react-native-google-translate");
const locale_mapper_util_1 = require("../utils/locale-mapper.util");
async function translateField(value, targetLang, isArray) {
    if (isArray) {
        const results = [];
        for (const item of value) {
            const result = await react_native_google_translate_1.googleTranslateService.translate({
                text: item,
                targetLanguage: targetLang,
                sourceLanguage: "en",
            });
            results.push(result.translatedText);
        }
        return results;
    }
    const result = await react_native_google_translate_1.googleTranslateService.translate({
        text: value,
        targetLanguage: targetLang,
        sourceLanguage: "en",
    });
    return result.translatedText;
}
class MetadataTranslationService {
    async translateMetadata(metadata, targetLocales, onProgress) {
        // Initialize google translate service
        if (!react_native_google_translate_1.googleTranslateService.isInitialized()) {
            react_native_google_translate_1.googleTranslateService.initialize({
                minDelay: 100,
                maxRetries: 3,
                timeout: 10000,
            });
        }
        const result = {
            "en-US": metadata,
        };
        const localesToTranslate = targetLocales.filter((locale) => !(0, locale_mapper_util_1.isEnglishVariant)(locale));
        for (const locale of localesToTranslate) {
            const translatedMetadata = {
                title: metadata.title,
            };
            const fieldTranslations = [
                { field: "title", value: metadata.title, isArray: false },
                { field: "subtitle", value: metadata.subtitle, isArray: false },
                { field: "keywords", value: metadata.keywords, isArray: true },
                { field: "description", value: metadata.description, isArray: false },
                { field: "promotionalText", value: metadata.promotionalText, isArray: false },
            ];
            for (const { field, value, isArray } of fieldTranslations) {
                if (!value)
                    continue;
                try {
                    onProgress?.({ field, locale, status: "translating" });
                    translatedMetadata[field] =
                        await translateField(value, (0, locale_mapper_util_1.getGoogleTranslateLang)(locale), isArray);
                    onProgress?.({ field, locale, status: "completed" });
                }
                catch (error) {
                    onProgress?.({
                        field,
                        locale,
                        status: "error",
                        error: error,
                    });
                    translatedMetadata[field] = value;
                }
            }
            result[locale] = translatedMetadata;
        }
        for (const locale of targetLocales) {
            if ((0, locale_mapper_util_1.isEnglishVariant)(locale) && locale !== "en-US") {
                result[locale] = metadata;
            }
        }
        return result;
    }
}
exports.MetadataTranslationService = MetadataTranslationService;
exports.metadataTranslationService = new MetadataTranslationService();
