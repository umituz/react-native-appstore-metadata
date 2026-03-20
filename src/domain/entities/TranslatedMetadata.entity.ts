/**
 * Translated Metadata Entity
 * @description Type definitions for translated metadata results
 */

import type { AppStoreMetadata } from "./AppStoreMetadata.entity";

export interface TranslatedMetadata extends Record<string, AppStoreMetadata> {
  "en-US": AppStoreMetadata;
}
