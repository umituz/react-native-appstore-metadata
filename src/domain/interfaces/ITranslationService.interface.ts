/**
 * Translation Service Interface
 * @description Interface for metadata translation service
 */

import type { AppStoreMetadata } from "../entities/AppStoreMetadata.entity";
import type { TranslatedMetadata } from "../entities/TranslatedMetadata.entity";

export type TranslationStatus = "pending" | "translating" | "completed" | "error";

export interface TranslationProgress {
  field: string;
  locale: string;
  status: TranslationStatus;
  error?: Error;
}

export interface ITranslationService {
  /**
   * Translate app store metadata to multiple target locales
   * @param metadata - Source metadata (en-US)
   * @param targetLocales - Array of target locale codes (e.g., ['tr-TR', 'de-DE'])
   * @param onProgress - Optional progress callback
   * @returns Translated metadata for all locales
   */
  translateMetadata(
    metadata: AppStoreMetadata,
    targetLocales: readonly string[],
    onProgress?: (progress: TranslationProgress) => void
  ): Promise<TranslatedMetadata>;
}
