# 技術スタック

## バックエンド
- **Node.js** 20以上
- **Fastify** - 高速なWebフレームワーク
- **TypeScript** 5.3.3 - 型安全性
- **Redis** - データキャッシュ
- **WebSocket** (@fastify/websocket) - リアルタイム通信
- **node-cron** - 定期的なデータ取得

### 主要なパッケージ
- axios - HTTP通信
- pino - ロギング
- dotenv - 環境変数管理

## フロントエンド
- **React** 19.1.0 - UIフレームワーク
- **TypeScript** 5.3.3 - 型安全性
- **Vite** 7.0.4 - ビルドツール
- **CSS Modules** - スタイリング
- **axios** - API通信

## インフラストラクチャ
- **Docker Compose** - バックエンドサービスのコンテナ管理（Redis + API）
- フロントエンドはホスト側で実行

## 外部API
- **Yahoo Finance** - 株価指数、為替レート（APIキー不要）
- **CoinGecko** - 暗号通貨価格（APIキー不要）
- **Alpha Vantage** - バックアップ用（APIキー必要）