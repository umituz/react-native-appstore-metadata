/**
 * @umituz/react-native-appstore-metadata
 * App Store metadata translator with multi-language support
 */

export type {
  AppStoreMetadata,
  AppStoreMetadataField,
} from "./domain/entities/AppStoreMetadata.entity";

export type {
  TranslatedMetadata,
} from "./domain/entities/TranslatedMetadata.entity";

export type { ITranslationProvider } from "./domain/interfaces/ITranslationProvider.interface";

export type {
  ITranslationService,
  TranslationProgress,
  TranslationStatus,
} from "./domain/interfaces/ITranslationService.interface";

export { TranslationService } from "./infrastructure/services/TranslationService.service";
export { GoogleTranslateProvider, googleTranslateProvider } from "./infrastructure/services/GoogleTranslateProvider.service";

export { translateText } from "./infrastructure/utils/translator.util";
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
