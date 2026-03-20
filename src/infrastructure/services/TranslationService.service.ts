/**
 * Translation Service
 * @description Core service for translating app store metadata
 */

import type {
  ITranslationService,
  TranslationProgress,
} from "../../domain/interfaces/ITranslationService.interface";
import type { ITranslationProvider } from "../../domain/interfaces/ITranslationProvider.interface";
import type {
  AppStoreMetadata,
} from "../../domain/entities/AppStoreMetadata.entity";
import type {
  TranslatedMetadata,
} from "../../domain/entities/TranslatedMetadata.entity";
import {
  getGoogleTranslateLang,
  isEnglishVariant,
} from "../utils/locale-mapper.util";

async function translateField<T extends string | string[]>(
  provider: ITranslationProvider,
  value: T,
  targetLang: string,
  isArray: boolean
): Promise<T> {
  if (isArray) {
    return (await provider.translateBatch(value as string[], targetLang)) as T;
  }
  return (await provider.translate(value as string, targetLang)) as T;
}

export class TranslationService implements ITranslationService {
  constructor(private provider: ITranslationProvider) {}

  async translateMetadata(
    metadata: AppStoreMetadata,
    targetLocales: readonly string[],
    onProgress?: (progress: TranslationProgress) => void
  ): Promise<TranslatedMetadata> {
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
            await translateField(this.provider, value, getGoogleTranslateLang(locale), isArray);
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
