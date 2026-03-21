#!/usr/bin/env node

/**
 * App Store Metadata Generate Script
 * @description Generates asc-metadata JSON files from translated locale files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

export interface GenerateAppStoreOptions {
  sourceDir: string;
  outputDir: string;
}

export async function generateAppStoreMetadata(options: GenerateAppStoreOptions): Promise<void> {
  const { sourceDir, outputDir } = options;

  const sourcePath = path.resolve(process.cwd(), sourceDir);

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source directory not found: ${sourcePath}`);
    return;
  }

  // Create output directory if it doesn't exist
  const outputPath = path.resolve(process.cwd(), outputDir);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  console.log('\n📝 Generating App Store metadata .strings files...\n');

  // Get all locale files
  const files = fs.readdirSync(sourcePath)
    .filter(f => f.match(/^[a-z]{2}-[A-Z]{2}\.ts$/) && f !== 'en-US.ts')
    .sort();

  // Include en-US
  const allFiles = ['en-US.ts', ...files];

  console.log(`📊 Locales to process: ${allFiles.length}\n`);

  for (const file of allFiles) {
    const langCode = file.replace('.ts', '');
    console.log(`🌍 Processing ${langCode}...`);

    const sourceFilePath = path.join(sourcePath, file);

    // Import metadata
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const metadata: AppStoreMetadata = require(sourceFilePath).default;

      // Convert to App Store .strings format
      const stringsContent = `"description" = ${JSON.stringify(metadata.description)};
"keywords" = ${JSON.stringify(metadata.keywords)};
"promotionalText" = ${JSON.stringify(metadata.promotionalText)};
"whatsNew" = ${JSON.stringify(metadata.whatsNew)};
${metadata.supportUrl ? `"supportUrl" = ${JSON.stringify(metadata.supportUrl)};` : ''}
${metadata.marketingUrl ? `"marketingUrl" = ${JSON.stringify(metadata.marketingUrl)};` : ''}
`;

      // Write .strings file
      const targetFilePath = path.join(outputPath, `${langCode}.strings`);
      fs.writeFileSync(targetFilePath, stringsContent);

      console.log(`  ✅ Generated: ${langCode}.strings\n`);
    } catch (error) {
      console.log(`  ⚠️  Failed to process ${langCode}: ${(error as Error).message}\n`);
    }
  }

  console.log('✅ All .strings files generated!');
  console.log(`\n📁 Output directory: ${outputPath}`);
  console.log('\n🚀 Next step: Upload to App Store Connect');
  console.log(`   asc localizations upload --version "VERSION_ID" --path ${outputDir}\n`);
}

// CLI interface
export function runGenerateAppStore(): void {
  const args = process.argv.slice(2);
  const sourceDir = args[0] || 'app-store-locales';
  const outputDir = args[1] || 'asc-metadata/app-info';

  console.log('🚀 Generating App Store metadata JSON files...');
  generateAppStoreMetadata({ sourceDir, outputDir }).catch(err => {
    console.error('\n❌ Generation failed:', err.message);
    process.exit(1);
  });
}

// Check if this file is being run directly
if (require.main === module || process.argv[1].endsWith('/generate.js') || process.argv[1].endsWith('\\generate.js')) {
  runGenerateAppStore();
}
