/**
 * @umituz/react-native-appstore-metadata
 * App Store metadata management with multi-language support
 */

export type {
  AppStoreMetadata,
  AppStoreMetadataField,
} from "./domain/entities/AppStoreMetadata.entity";

export type {
  TranslatedMetadata,
} from "./domain/entities/TranslatedMetadata.entity";

export type {
  ITranslationService,
  TranslationProgress,
  TranslationStatus,
} from "./domain/interfaces/ITranslationService.interface";

export { MetadataTranslationService, metadataTranslationService } from "./infrastructure/services/MetadataTranslationService.service";

export {
  getGoogleTranslateLang,
  isEnglishVariant,
  getLocaleDisplayName,
} from "./infrastructure/utils/locale-mapper.util";

export { SUPPORTED_LOCALES } from "./infrastructure/constants/languages.constants";
export { GOOGLE_TRANSLATE_LANG_MAP } from "./infrastructure/constants/locale-mapping.constants";

export {
  useAppStoreTranslator,
  type UseAppStoreTranslatorOptions,
  type UseAppStoreTranslatorReturn,
} from "./presentation/hooks/useAppStoreTranslator.hook";
