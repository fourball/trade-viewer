# プロジェクト構造

## ルートディレクトリ
```
trade-viewer/
├── backend/         # バックエンドアプリケーション
├── frontend/        # フロントエンドアプリケーション  
├── docker/          # Docker設定
├── docs/            # ドキュメント
├── .serena/         # Serena設定
├── CLAUDE.md        # プロジェクト固有の指示
├── README.md        # プロジェクト説明
└── package.json     # ルートpackage.json（claude-code用）
```

## バックエンド構造
```
backend/
├── src/
│   ├── index.ts              # エントリーポイント
│   ├── server.ts             # Fastifyサーバー設定
│   ├── types/
│   │   └── market.ts         # 市場データ型定義
│   ├── plugins/
│   │   └── redis.ts          # Redisプラグイン
│   ├── routes/
│   │   ├── health.ts         # ヘルスチェック
│   │   ├── market.ts         # 市場データAPI
│   │   └── websocket.ts      # WebSocketルート
│   ├── services/
│   │   ├── cache.ts          # キャッシュサービス
│   │   ├── marketData.ts     # 市場データサービス
│   │   ├── websocketManager.ts # WebSocket管理
│   │   └── dataProviders/    # データプロバイダー
│   │       ├── base.ts       # 基底クラス
│   │       ├── mock.ts       # モックデータ
│   │       ├── yahooFinance.ts # Yahoo Finance
│   │       ├── coinGecko.ts  # CoinGecko
│   │       └── alphaVantage.ts # Alpha Vantage
│   ├── utils/
│   │   └── logger.ts         # ロギング設定
│   └── workers/
│       └── marketDataFetcher.ts # 定期データ取得
├── Dockerfile                # 本番用
├── Dockerfile.dev            # 開発用
├── package.json
├── tsconfig.json
└── .eslintrc.js
```

## フロントエンド構造
```
frontend/
├── src/
│   ├── main.tsx              # エントリーポイント
│   ├── App.tsx               # ルートコンポーネント
│   ├── components/
│   │   ├── MarketDashboard.tsx    # ダッシュボード
│   │   ├── MarketCard.tsx         # 市場データカード
│   │   └── *.module.css          # CSS Modules
│   ├── hooks/
│   │   └── useWebSocket.ts   # WebSocketフック
│   ├── services/
│   │   └── api.ts            # API通信
│   ├── types/
│   │   └── index.ts          # 型定義
│   └── assets/               # 静的ファイル
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

## Docker構造
```
docker/
├── docker-compose.yml        # Docker Compose設定
└── .env.example             # 環境変数サンプル
```