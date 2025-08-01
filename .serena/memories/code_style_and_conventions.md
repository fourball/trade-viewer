# コードスタイルと規約

## TypeScript設定
### バックエンド (tsconfig.json)
- target: ES2022
- module: commonjs
- strict: true（strictモード有効）
- noUnusedLocals/noUnusedParameters: true
- experimentalDecorators: true

### フロントエンド
- target: ES2020
- module: ESNext
- jsx: react-jsx
- strict: true

## 命名規則
- ファイル名: camelCase（例: marketData.ts, useWebSocket.ts）
- 変数・関数: camelCase
- クラス・型・インターフェース: PascalCase
- 定数: UPPER_SNAKE_CASE（例: MARKET_SYMBOLS）
- Reactコンポーネント: PascalCase

## ディレクトリ構成
### バックエンド
```
src/
├── types/       # TypeScript型定義
├── plugins/     # Fastifyプラグイン
├── routes/      # APIルート
├── services/    # ビジネスロジック
├── utils/       # ユーティリティ
└── workers/     # バックグラウンドタスク
```

### フロントエンド
```
src/
├── components/  # Reactコンポーネント
├── hooks/       # カスタムフック
├── services/    # API通信
├── types/       # TypeScript型定義
└── assets/      # 静的ファイル
```

## ESLint設定
### バックエンド
- @typescript-eslint推奨設定を使用
- no-console: warn
- no-unused-vars: error（_で始まる引数は除外）
- prefer-const: error

### フロントエンド
- typescript-eslint推奨設定
- react-hooks推奨設定
- react-refresh設定（Vite用）

## その他の規約
- エラーハンドリングは適切に行う（try-catch）
- 非同期処理はasync/awaitを使用
- インポート順序: 外部ライブラリ → 内部モジュール → 型定義
- CSS ModulesでスタイリングM（styles.cssからstyles.module.cssへ）