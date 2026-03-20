/**
 * Translation Provider Interface
 * @description Abstract interface for translation providers (Google, AI providers, etc.)
 */

export interface ITranslationProvider {
  /**
   * Translate a single text string
   * @param text - Text to translate
   * @param targetLang - Target language code (e.g., 'tr', 'de', 'fr')
   * @returns Translated text or original text on failure
   */
  translate(text: string, targetLang: string): Promise<string>;

  /**
   * Translate multiple text strings in batch
   * @param texts - Array of texts to translate
   * @param targetLang - Target language code
   * @returns Array of translated texts
   */
  translateBatch(texts: string[], targetLang: string): Promise<string[]>;

  /**
   * Check if provider is available and ready
   */
  isAvailable(): boolean;
}
