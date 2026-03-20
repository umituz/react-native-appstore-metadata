/**
 * App Store Metadata Entity
 * @description Type definitions for app store metadata fields
 */

export interface AppStoreMetadata {
  title: string;
  subtitle?: string;
  keywords?: string[];
  description?: string;
  promotionalText?: string;
}

export type AppStoreMetadataField = keyof AppStoreMetadata;
