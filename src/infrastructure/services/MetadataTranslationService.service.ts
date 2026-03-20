/**
 * Metadata Translation Service
 * @description Service for translating app store metadata using @umituz/react-native-google-translate
 */

import type {
  AppStoreMetadata,
  AppStoreMetadataField,
} from "../../domain/entities/AppStoreMetadata.entity";
import type {
  TranslatedMetadata,
} from "../../domain/entities/TranslatedMetadata.entity";
import type {
  ITranslationService,
  TranslationProgress,
} from "../../domain/interfaces/ITranslationService.interface";
import { googleTranslateService } from "@umituz/react-native-google-translate";
import {
  getGoogleTranslateLang,
  isEnglishVariant,
} from "../utils/locale-mapper.util";

async function translateField<T extends string | string[]>(
  value: T,
  targetLang: string,
  isArray: boolean
): Promise<T> {
  if (isArray) {
    const results: string[] = [];
    for (const item of value as string[]) {
      const result = await googleTranslateService.translate({
        text: item,
        targetLanguage: targetLang,
        sourceLanguage: "en",
      });
      results.push(result.translatedText);
    }
    return results as T;
  }

  const result = await googleTranslateService.translate({
    text: value as string,
    targetLanguage: targetLang,
    sourceLanguage: "en",
  });
  return result.translatedText as T;
}

export class MetadataTranslationService implements ITranslationService {
  async translateMetadata(
    metadata: AppStoreMetadata,
    targetLocales: readonly string[],
    onProgress?: (progress: TranslationProgress) => void
  ): Promise<TranslatedMetadata> {
    // Initialize google translate service
    if (!googleTranslateService.isInitialized()) {
      googleTranslateService.initialize({
        minDelay: 100,
        maxRetries: 3,
        timeout: 10000,
      });
    }

    const result: TranslatedMetadata = {
      "en-US": metadata,
    };

    const localesToTranslate = targetLocales.filter(
      (locale) => !isEnglishVariant(locale)
    );

    for (const locale of localesToTranslate) {
      const translatedMetadata: AppStoreMetadata = {
        title: metadata.title,
      };

      const fieldTranslations: Array<{
        field: keyof AppStoreMetadata;
        value: string | string[] | undefined;
        isArray: boolean;
      }> = [
        { field: "title", value: metadata.title, isArray: false },
        { field: "subtitle", value: metadata.subtitle, isArray: false },
        { field: "keywords", value: metadata.keywords, isArray: true },
        { field: "description", value: metadata.description, isArray: false },
        { field: "promotionalText", value: metadata.promotionalText, isArray: false },
      ];

      for (const { field, value, isArray } of fieldTranslations) {
        if (!value) continue;

        try {
          onProgress?.({ field, locale, status: "translating" });
          (translatedMetadata as unknown as Record<string, unknown>)[field] =
            await translateField(value, getGoogleTranslateLang(locale), isArray);
          onProgress?.({ field, locale, status: "completed" });
        } catch (error) {
          onProgress?.({
            field,
            locale,
            status: "error",
            error: error as Error,
          });
          (translatedMetadata as unknown as Record<string, unknown>)[field] = value;
        }
      }

      result[locale] = translatedMetadata;
    }

    for (const locale of targetLocales) {
      if (isEnglishVariant(locale) && locale !== "en-US") {
        result[locale] = metadata;
      }
    }

    return result;
  }
}

export const metadataTranslationService = new MetadataTranslationService();
