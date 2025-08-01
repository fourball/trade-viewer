# Docker構成仕様書

## 概要

環境ごとに設定を切り替え可能なDocker Compose構成。
開発環境と本番環境で異なる設定を適用できる。

## ディレクトリ構成

```
docker/
├── docker-compose.yml    # ベース設定
├── .env.example         # 環境変数テンプレート
└── env/
    ├── local.yml        # ローカル環境用オーバーライド
    └── production.yml   # 本番環境用オーバーライド
```

## 環境切り替えの仕組み

Makefileを使用して環境を切り替え：

```bash
# ローカル環境（デフォルト）
make up

# 本番環境
make up ENV=production
```

内部的には以下のコマンドが実行される：
```bash
docker compose -f docker/docker-compose.yml -f docker/env/local.yml up -d
```

## サービス構成

### 1. api サービス

**役割**: 
- REST API提供
- WebSocket接続管理
- 定期的なデータ取得（cron）

**設定**:
```yaml
api:
  build:
    context: ../backend
    dockerfile: Dockerfile
  ports:
    - "${API_PORT:-3001}:3001"
  environment:
    - NODE_ENV=${NODE_ENV:-development}
    - REDIS_URL=redis://redis:6379
  volumes:
    - ../backend:/app           # ソースコードマウント
    - /app/node_modules        # node_modulesは除外
```

### 2. redis サービス

**役割**: 
- 市場データのキャッシュ
- セッション管理（将来的）

**設定**:
```yaml
redis:
  image: redis:7-alpine
  volumes:
    - redis-data:/data          # データ永続化
```

## 環境別設定

### local.yml（開発環境）

- ホットリロード有効
- デバッグログ出力
- ポート公開（Redis: 6379）
- `npm run dev` で起動

### production.yml（本番環境）

- 自動再起動設定（restart: unless-stopped）
- 本番ログレベル（info）
- `npm run start` で起動
- 最適化されたビルド

## 環境変数

`.env.example` をコピーして `.env` を作成：

```bash
# API設定
API_PORT=3001
NODE_ENV=development

# 外部API設定
ALPHA_VANTAGE_API_KEY=your_api_key_here
EXCHANGE_RATE_API_KEY=your_api_key_here

# Redis設定
REDIS_URL=redis://redis:6379
```

## ボリューム

- `redis-data`: Redisデータの永続化
- バックエンドのソースコードは開発時にマウント

## ネットワーク

- デフォルトのbridge networkを使用
- サービス間は`redis`、`api`のホスト名で通信可能
- 外部からはポートマッピングでアクセス

## ビルド＆デプロイ

### 開発環境
```bash
# イメージビルド
make build

# 起動
make up

# ログ確認
make logs
```

### 本番環境
```bash
# 本番用ビルド
make build ENV=production

# 本番環境起動
make up ENV=production
```

## トラブルシューティング

### ポート競合
```bash
# 使用中のポート確認
lsof -i :3001
lsof -i :6379

# .envでポート変更
API_PORT=3002
```

### ボリュームクリーンアップ
```bash
# 全削除（データも消える）
make clean
```