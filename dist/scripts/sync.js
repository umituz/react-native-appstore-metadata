#!/usr/bin/env node
"use strict";
/**
 * App Store Metadata Sync Script
 * @description Translates and generates App Store metadata in one command
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncAppStoreMetadata = syncAppStoreMetadata;
exports.runSyncAppStore = runSyncAppStore;
const translate_1 = require("./translate");
const generate_1 = require("./generate");
async function syncAppStoreMetadata(options) {
    console.log('🔄 Starting App Store metadata sync...\n');
    // Step 1: Translate
    console.log('Step 1: Translating metadata...\n');
    await (0, translate_1.translateAppStoreMetadata)({
        sourceDir: options.sourceDir,
        skipEnglish: options.skipEnglish,
    });
    // Step 2: Generate JSON
    console.log('\nStep 2: Generating JSON files...\n');
    await (0, generate_1.generateAppStoreMetadata)({
        sourceDir: options.sourceDir,
        outputDir: options.outputDir,
    });
    console.log('\n✅ Sync completed successfully!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Review generated JSON files in:', options.outputDir);
    console.log('   2. Push to App Store Connect:');
    console.log(`      asc metadata push --app "YOUR_APP_ID" --dir ${options.outputDir}\n`);
}
// CLI interface
function runSyncAppStore() {
    const args = process.argv.slice(2);
    const sourceDir = args[0] || 'app-store-locales';
    const outputDir = args[1] || 'asc-metadata/app-info';
    const skipEnglish = args.includes('--skip-english');
    syncAppStoreMetadata({ sourceDir, outputDir, skipEnglish }).catch(err => {
        console.error('\n❌ Sync failed:', err.message);
        process.exit(1);
    });
}
// Check if this file is being run directly
if (require.main === module || process.argv[1].endsWith('/sync.js') || process.argv[1].endsWith('\\sync.js')) {
    runSyncAppStore();
}
