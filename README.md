# Trade Viewer

リアルタイム金融市場データダッシュボード

## 概要

株価指数、暗号通貨、為替、商品価格をリアルタイムで表示するWebアプリケーション。

### 表示データ
- 日経平均
- ナスダック（現物・先物）
- ダウ平均（現物・先物）
- ビットコイン
- ゴールド
- USD/JPY
- 香港ハンセン指数

## クイックスタート

```bash
# 1. バックエンドの起動（Docker）
cd docker
cp -Rp env/.env.local .env
docker compose up -d

# 2. フロントエンドの起動
cd ../frontend
npm install
npm run dev

# ブラウザでアクセス
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
```

### APIキーについて

実際の市場データを取得するにはAPIキーが必要です：
- [APIキー取得ガイド](docs/api-keys-guide.md) を参照してください
- **APIキーなしでもモックデータで動作します**（開発・デモ用）

## ドキュメント

- [アーキテクチャ設計](docs/architecture.md)
- [データソース仕様](docs/data-sources.md)
- [API仕様](docs/api-spec.md)
- [開発ガイド](docs/development.md)
- [APIキー取得ガイド](docs/api-keys-guide.md)

## 技術スタック

- **Backend**: Node.js, Fastify, TypeScript, Redis
- **Frontend**: Vite, React, TypeScript
- **Infrastructure**: Docker Compose
- **Data Sources**: Yahoo Finance, CoinGecko, Exchange Rate API, Alpha Vantage

## ライセンス

MIT