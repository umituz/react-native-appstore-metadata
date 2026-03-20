# @umituz/react-native-appstore-metadata

App Store metadata translator with multi-language support using Google Translate API.

## Features

- ✅ **Field-by-field translation**: Translate each metadata field individually
- ✅ **40+ languages**: Support for 40+ locales including Turkish, German, French, etc.
- ✅ **Marketing-adapted**: Maintains marketing tone and cultural appropriateness
- ✅ **Provider-agnostic**: Easy to swap translation providers
- ✅ **Progress tracking**: Real-time progress callbacks during translation
- ✅ **Type-safe**: Full TypeScript support
- ✅ **React Native ready**: Optimized for React Native applications

## Installation

```bash
npm install @umituz/react-native-appstore-metadata
```

## Supported Languages

- Arabic (Saudi Arabia)
- Bulgarian
- Chinese (Simplified & Traditional)
- Czech
- Danish
- Dutch
- English (Australia, Canada, UK, US)
- Finnish
- French (Canada, France)
- German
- Greek
- Hindi
- Hungarian
- Indonesian
- Italian
- Japanese
- Korean
- Malay
- Norwegian
- Polish
- Portuguese (Brazil, Portugal)
- Romanian
- Russian
- Slovak
- Slovenian
- Spanish (Spain, Mexico)
- Swedish
- Thai
- Tagalog
- Turkish
- Ukrainian
- Vietnamese

## Usage

### Basic Usage

```typescript
import { useAppStoreTranslator } from '@umituz/react-native-appstore-metadata/presentation';

function MyComponent() {
  const { translateMetadata, isTranslating, progress } = useAppStoreTranslator({
    locales: ['tr-TR', 'de-DE', 'fr-FR']
  });

  const handleTranslate = async () => {
    const metadata = {
      title: 'My Amazing App',
      subtitle: 'Do amazing things',
      keywords: ['productivity', 'tools', 'awesome'],
      description: 'This app does amazing stuff for you.',
      promotionalText: 'Download now!'
    };

    const translated = await translateMetadata(metadata, (progress) => {
      console.log(`Translating ${progress.field} to ${progress.locale}`);
    });

    console.log(translated['tr-TR'].title); // "Harikalar Diyarı Uygulamam"
  };

  return (
    <button onPress={handleTranslate} disabled={isTranslating}>
      {isTranslating ? 'Translating...' : 'Translate Metadata'}
    </button>
  );
}
```

### Advanced Usage with Custom Provider

```typescript
import { useAppStoreTranslator } from '@umituz/react-native-appstore-metadata/presentation';
import { TranslationService } from '@umituz/react-native-appstore-translator/infrastructure';
import { myCustomProvider } from './my-custom-provider';

function MyComponent() {
  const { translateMetadata } = useAppStoreTranslator({
    provider: myCustomProvider,
    locales: ['ja-JP', 'ko-KR', 'zh-CN']
  });

  // ... rest of the code
}
```

### Type-Safe Usage

```typescript
import type {
  AppStoreMetadata,
  TranslatedMetadata
} from '@umituz/react-native-appstore-translator/domain';

const metadata: AppStoreMetadata = {
  title: 'My App',
  subtitle: 'Best app ever',
  keywords: ['awesome', 'productivity'],
  description: 'Long description here...',
  promotionalText: 'Download now!'
};

// After translation
const translated: TranslatedMetadata = await translateMetadata(metadata);
console.log(translated['tr-TR'].title);
```

## API Reference

### useAppStoreTranslator

Main React hook for translation.

#### Options

```typescript
interface UseAppStoreTranslatorOptions {
  provider?: ITranslationProvider;  // Default: GoogleTranslateProvider
  locales?: string[];               // Default: All supported locales
}
```

#### Return Value

```typescript
interface UseAppStoreTranslatorReturn {
  translateMetadata: (
    metadata: AppStoreMetadata,
    onProgress?: (progress: TranslationProgress) => void
  ) => Promise<TranslatedMetadata>;
  isTranslating: boolean;
  progress: TranslationProgress[];
  error: Error | null;
}
```

### AppStoreMetadata

```typescript
interface AppStoreMetadata {
  readonly title: string;
  readonly subtitle?: string;
  readonly keywords?: string[];
  readonly description?: string;
  readonly promotionalText?: string;
}
```

### TranslationProgress

```typescript
interface TranslationProgress {
  field: string;
  locale: string;
  status: 'pending' | 'translating' | 'completed' | 'error';
  progress?: number;
  error?: Error;
}
```

## Architecture

This package follows Domain-Driven Design (DDD) principles with clean separation of concerns:

```
src/
├── domain/           # Core business logic and types
├── infrastructure/   # External integrations (Google Translate)
└── presentation/     # React hooks and components
```

## Subpath Imports

This package supports subpath imports for better tree-shaking:

```typescript
// Import only what you need
import { useAppStoreTranslator } from '@umituz/react-native-appstore-metadata/presentation';
import type { AppStoreMetadata } from '@umituz/react-native-appstore-metadata/domain';
import { googleTranslateProvider } from '@umituz/react-native-appstore-translator/infrastructure';
```

## License

MIT

## Author

umituz

## Repository

https://github.com/umituz/react-native-appstore-metadata
