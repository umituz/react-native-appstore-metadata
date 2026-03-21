#!/usr/bin/env node
"use strict";
/**
 * App Store Metadata Generate Script
 * @description Generates asc-metadata JSON files from translated locale files
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAppStoreMetadata = generateAppStoreMetadata;
exports.runGenerateAppStore = runGenerateAppStore;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const locale_mapping_constants_1 = require("../infrastructure/constants/locale-mapping.constants");
async function generateAppStoreMetadata(options) {
    const { sourceDir, outputDir } = options;
    const sourcePath = path_1.default.resolve(process.cwd(), sourceDir);
    if (!fs_1.default.existsSync(sourcePath)) {
        console.error(`❌ Source directory not found: ${sourcePath}`);
        return;
    }
    // Create output directory if it doesn't exist
    const outputPath = path_1.default.resolve(process.cwd(), outputDir);
    if (!fs_1.default.existsSync(outputPath)) {
        fs_1.default.mkdirSync(outputPath, { recursive: true });
    }
    console.log('\n📝 Generating App Store metadata .strings files...\n');
    // Get all locale files
    const files = fs_1.default.readdirSync(sourcePath)
        .filter(f => f.match(/^[a-z]{2}-[A-Z]{2}\.ts$/) && f !== 'en-US.ts')
        .sort();
    // Include en-US
    const allFiles = ['en-US.ts', ...files];
    console.log(`📊 Locales to process: ${allFiles.length}\n`);
    for (const file of allFiles) {
        const langCode = file.replace('.ts', '');
        console.log(`🌍 Processing ${langCode}...`);
        const sourceFilePath = path_1.default.join(sourcePath, file);
        // Import metadata
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const metadata = require(sourceFilePath).default;
            // Convert to App Store .strings format
            const stringsContent = `"name" = ${JSON.stringify(metadata.name)};
"subtitle" = ${JSON.stringify(metadata.subtitle)};
"description" = ${JSON.stringify(metadata.description)};
"keywords" = ${JSON.stringify(metadata.keywords)};
"promotionalText" = ${JSON.stringify(metadata.promotionalText)};
"whatsNew" = ${JSON.stringify(metadata.whatsNew)};
${metadata.supportUrl ? `"supportUrl" = ${JSON.stringify(metadata.supportUrl)};` : ''}
${metadata.marketingUrl ? `"marketingUrl" = ${JSON.stringify(metadata.marketingUrl)};` : ''}
${metadata.privacyPolicyUrl ? `"privacyPolicyUrl" = ${JSON.stringify(metadata.privacyPolicyUrl)};` : ''}
`;
            // Map locale code to App Store Connect format
            const ascLocale = locale_mapping_constants_1.ASC_LOCALE_MAP[langCode] || langCode;
            // Write .strings file
            const targetFilePath = path_1.default.join(outputPath, `${ascLocale}.strings`);
            fs_1.default.writeFileSync(targetFilePath, stringsContent);
            console.log(`  ✅ Generated: ${ascLocale}.strings (${langCode})\n`);
        }
        catch (error) {
            console.log(`  ⚠️  Failed to process ${langCode}: ${error.message}\n`);
        }
    }
    console.log('✅ All .strings files generated!');
    console.log(`\n📁 Output directory: ${outputPath}`);
    console.log('\n🚀 Next step: Upload to App Store Connect');
    console.log(`   asc localizations upload --version "VERSION_ID" --path ${outputDir}\n`);
}
// CLI interface
function runGenerateAppStore() {
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
