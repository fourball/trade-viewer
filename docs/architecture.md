# Trade Viewer アーキテクチャ設計書

## 概要

金融市場データ（株価、為替、暗号通貨、商品）をリアルタイムで表示するダッシュボードアプリケーション。

## 技術スタック

### バックエンド
- **Node.js** (v20+)
- **Fastify** - 高速WebフレームワークC
- **Redis** - データキャッシュ
- **node-cron** - 定期実行
- **TypeScript** - 型安全性

### フロントエンド
- **React** (v18+) - UIフレームワーク
- **TypeScript** - 型安全性
- **Vite** - ビルドツール
- **CSS Modules** - スタイリング
- **WebSocket** - リアルタイム通信

### インフラ
- **Docker Compose** - 開発環境（バックエンドのみ）
- **EC2** - バックエンドホスティング（予定）
- **Vercel/Netlify** - フロントエンドホスティング（予定）

## システム構成

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   CDN       │────▶│  Frontend   │
└─────────────┘     │ (Vercel)    │     │   (Vite)    │
       │            └─────────────┘     └─────────────┘
       │                                        
       │ WebSocket/REST API                    
       ▼                                        
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Fastify   │────▶│    Redis    │     │  External   │
│   Server    │     │   Cache     │     │    APIs     │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                        │
       │                                        │
       └────────────────────────────────────────┘
                    Cron Job (1分毎)
```

## データフロー

1. **定期取得** (1分毎)
   - Fastifyサーバー内のcronジョブが外部APIからデータ取得
   - 取得したデータをRedisに保存

2. **クライアントリクエスト**
   - フロントエンドがWebSocket接続を確立
   - 初回データをREST APIで取得
   - 以降はWebSocketで更新通知を受信

3. **キャッシュ戦略**
   - Redis TTL: 5分
   - 失敗時は前回の値を保持

## API設計

### REST エンドポイント

```
GET /api/v1/market/all
  - 全市場データを取得

GET /api/v1/market/:symbol
  - 特定シンボルのデータを取得

GET /api/health
  - ヘルスチェック
```

### WebSocket イベント

```
// クライアント → サーバー
subscribe: { symbols: ['NKY', 'BTCUSDT', ...] }
unsubscribe: { symbols: ['NKY'] }

// サーバー → クライアント
initial: { data: [...] }  // 初回接続時の全データ
update: { data: {...} }   // 個別データ更新
error: { message: 'エラーメッセージ' }
```

## セキュリティ

- APIキーは環境変数で管理
- CORS設定でオリジン制限
- Rate Limiting実装
- HTTPSのみ許可