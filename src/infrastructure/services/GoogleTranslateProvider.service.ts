/**
 * Google Translate Provider Service
 * @description Google Translate API implementation for translation
 */

import type { ITranslationProvider } from "../../domain/interfaces/ITranslationProvider.interface";
import { translateText } from "../utils/translator.util";

export class GoogleTranslateProvider implements ITranslationProvider {
  isAvailable(): boolean {
    return true;
  }

  async translate(text: string, targetLang: string): Promise<string> {
    return translateText(text, targetLang);
  }

  async translateBatch(texts: string[], targetLang: string): Promise<string[]> {
    const results: string[] = [];
    for (const text of texts) {
      const result = await translateText(text, targetLang);
      results.push(result);
    }
    return results;
  }
}

export const googleTranslateProvider = new GoogleTranslateProvider();
