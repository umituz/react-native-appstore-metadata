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
import type { ITranslationProvider } from "../../domain/interfaces/ITranslationProvider.interface";
import { TranslationService } from "../../infrastructure/services/TranslationService.service";
import { googleTranslateProvider } from "../../infrastructure/services/GoogleTranslateProvider.service";
import { SUPPORTED_LOCALES } from "../../infrastructure/constants/languages.constants";

export interface UseAppStoreTranslatorOptions {
  provider?: ITranslationProvider;
  locales?: string[];
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
  const {
    provider = googleTranslateProvider,
    locales: userLocales,
  } = options;

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
        const service = new TranslationService(provider);

        const progressTracker: TranslationProgress[] = [];

        const result = await service.translateMetadata(
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
    [provider, locales]
  );

  return {
    translateMetadata,
    isTranslating,
    progress,
    error,
  };
}
