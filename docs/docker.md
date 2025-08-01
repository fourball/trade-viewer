# Docker構成仕様書

## 概要

Docker Composeを使用したバックエンドサービスの構成。
Redisとバックエンド用のDockerfileが含まれている。
フロントエンドはホスト側で実行する。

## ディレクトリ構成

```
docker/
├── docker-compose.yml    # Docker Compose設定
└── .env.example         # 環境変数テンプレート
```

## 起動方法

```bash
cd docker
docker compose up -d
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

## 開発時の設定

- `Dockerfile.dev` を使用（開発用）
- ホットリロード有効
- ポート公開（API: 3001）
- `npm run dev` で起動

## 環境変数

`.env.example` をコピーして `.env` を作成：

```bash
# API設定
API_PORT=3001
NODE_ENV=development

# 外部API設定
ALPHA_VANTAGE_API_KEY=your_api_key_here

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

## Docker操作

### 基本操作
```bash
cd docker

# 起動
docker compose up -d

# 停止
docker compose down

# ログ確認
docker compose logs -f

# 再起動
docker compose restart
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
docker compose down -v
```