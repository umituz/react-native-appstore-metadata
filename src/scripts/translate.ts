#!/usr/bin/env node

/**
 * App Store Metadata Translation Script
 * @description Translates app store metadata to all supported languages
 */

import fs from 'fs';
import path from 'path';
import { googleTranslateService } from '@umituz/react-native-google-translate';
import { LANGUAGE_MAP, getLanguageDisplayName } from '../infrastructure/constants/languages.constants';

export interface AppStoreMetadata {
  name: string;
  subtitle: string;
  description: string;
  keywords: string;
  promotionalText: string;
  whatsNew: string;
  supportUrl?: string;
  marketingUrl?: string;
  privacyPolicyUrl?: string;
}

export interface TranslateAppStoreOptions {
  sourceDir: string;
  skipEnglish?: boolean;
}

export async function translateAppStoreMetadata(options: TranslateAppStoreOptions): Promise<void> {
  const { sourceDir, skipEnglish = false } = options;

  // Initialize google translate service
  googleTranslateService.initialize({
    minDelay: 100,
    maxRetries: 3,
    timeout: 10000,
  });

  const sourcePath = path.resolve(process.cwd(), sourceDir, 'en-US.ts');

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`);
    return;
  }

  // Import source metadata
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sourceMetadata: AppStoreMetadata = require(sourcePath).default;

  console.log('\n🌍 Translating App Store metadata...\n');

  // Get all supported languages
  const languages = Object.keys(LANGUAGE_MAP).filter(lang => {
    // Skip English variants
    if (lang.startsWith('en-') && lang !== 'en-US') return false;
    return true;
  }).sort();

  console.log(`📊 Languages to translate: ${languages.length}\n`);

  for (const langCode of languages) {
    if (langCode === 'en-US') {
      console.log(`⏭️  Skipping en-US (source language)`);
      continue;
    }

    const targetLang = LANGUAGE_MAP[langCode];
    if (!targetLang || targetLang === 'en') {
      console.log(`⏭️  Skipping ${langCode} (English variant)`);
      continue;
    }

    const langName = getLanguageDisplayName(langCode);
    console.log(`🌍 Translating ${langCode} (${langName})...`);

    const translatedMetadata: AppStoreMetadata = {
      ...sourceMetadata,
    };

    // Translate each field
    const fieldsToTranslate: Array<keyof AppStoreMetadata> = [
      'name',
      'subtitle',
      'promotionalText',
      'whatsNew',
    ];

    for (const field of fieldsToTranslate) {
      const text = sourceMetadata[field];
      if (!text) continue;

      try {
        const result = await googleTranslateService.translate({
          text,
          targetLanguage: targetLang,
          sourceLanguage: 'en',
        });

        if (result.success && result.translatedText !== text) {
          (translatedMetadata as unknown as Record<string, unknown>)[field] = result.translatedText;
          console.log(`  ✅ ${field}: "${text.substring(0, 30)}..." → "${result.translatedText.substring(0, 30)}..."`);
        }
      } catch (error) {
        console.log(`  ⚠️  ${field}: Translation failed, keeping original`);
      }
    }

    // Handle description separately (long text)
    if (sourceMetadata.description) {
      try {
        const result = await googleTranslateService.translate({
          text: sourceMetadata.description,
          targetLanguage: targetLang,
          sourceLanguage: 'en',
        });

        if (result.success && result.translatedText !== sourceMetadata.description) {
          translatedMetadata.description = result.translatedText;
          console.log(`  ✅ description: Translated (${sourceMetadata.description.length} → ${result.translatedText.length} chars)`);
        }
      } catch (error) {
        console.log(`  ⚠️  description: Translation failed, keeping original`);
      }
    }

    // Write translated metadata
    const targetPath = path.resolve(process.cwd(), sourceDir, `${langCode}.ts`);
    const content = `/**
 * App Store Metadata - ${langName}
 * Auto-generated from en-US.ts
 *
 * @description This file is auto-generated. Do not edit manually.
 * Edit app-store-locales/en-US.ts instead.
 */

export default {
  /**
   * App Name (30 characters max)
   */
  name: ${JSON.stringify(translatedMetadata.name)},

  /**
   * Subtitle (30 characters max)
   */
  subtitle: ${JSON.stringify(translatedMetadata.subtitle)},

  /**
   * Description (4000 characters max)
   */
  description: ${JSON.stringify(translatedMetadata.description)},

  /**
   * Keywords (100 characters max, comma-separated)
   */
  keywords: ${JSON.stringify(translatedMetadata.keywords)},

  /**
   * Promotional Text (170 characters max)
   */
  promotionalText: ${JSON.stringify(translatedMetadata.promotionalText)},

  /**
   * What's New (4000 characters max)
   */
  whatsNew: ${JSON.stringify(translatedMetadata.whatsNew)},
};
`;

    fs.writeFileSync(targetPath, content);
    console.log(`  ✅ File created: ${langCode}.ts\n`);
  }

  console.log('✅ All translations completed!');
}

// CLI interface
export function runTranslateAppStore(): void {
  const args = process.argv.slice(2);
  const sourceDir = args[0] || 'app-store-locales';
  const skipEnglish = args.includes('--skip-english');

  console.log('🚀 Starting App Store metadata translation...');
  translateAppStoreMetadata({ sourceDir, skipEnglish }).catch(err => {
    console.error('\n❌ Translation failed:', err.message);
    process.exit(1);
  });
}

// Check if this file is being run directly
if (require.main === module || process.argv[1].endsWith('/translate.js') || process.argv[1].endsWith('\\translate.js')) {
  runTranslateAppStore();
}
