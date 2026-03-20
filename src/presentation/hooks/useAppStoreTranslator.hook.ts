/**
 * useAppStoreTranslator Hook
 * @description Main React hook for app store metadata translation
 */

import { useCallback, useState } from "react";
import type {
  AppStoreMetadata,
} from "../../domain/entities/AppStoreMetadata.entity";
import type {
  TranslatedMetadata,
} from "../../domain/entities/TranslatedMetadata.entity";
import type {
  TranslationProgress,
} from "../../domain/interfaces/ITranslationService.interface";
import { metadataTranslationService } from "../../infrastructure/services/MetadataTranslationService.service";
import { SUPPORTED_LOCALES } from "../../infrastructure/constants/languages.constants";

export interface UseAppStoreTranslatorOptions {
  locales?: readonly string[];
}

export interface UseAppStoreTranslatorReturn {
  translateMetadata: (
    metadata: AppStoreMetadata,
    onProgress?: (progress: TranslationProgress) => void
  ) => Promise<TranslatedMetadata>;
  isTranslating: boolean;
  progress: TranslationProgress[];
  error: Error | null;
}

export function useAppStoreTranslator(
  options: UseAppStoreTranslatorOptions = {}
): UseAppStoreTranslatorReturn {
  const { locales: userLocales } = options;

  const locales: readonly string[] = userLocales ?? SUPPORTED_LOCALES;

  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState<TranslationProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const translateMetadata = useCallback(
    async (
      metadata: AppStoreMetadata,
      onProgress?: (progress: TranslationProgress) => void
    ): Promise<TranslatedMetadata> => {
      setIsTranslating(true);
      setError(null);
      setProgress([]);

      try {
        const progressTracker: TranslationProgress[] = [];

        const result = await metadataTranslationService.translateMetadata(
          metadata,
          locales,
          (progressUpdate) => {
            progressTracker.push(progressUpdate);
            setProgress([...progressTracker]);
            onProgress?.(progressUpdate);
          }
        );

        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Translation failed");
        setError(error);
        throw error;
      } finally {
        setIsTranslating(false);
      }
    },
    [locales]
  );

  return {
    translateMetadata,
    isTranslating,
    progress,
    error,
  };
}
