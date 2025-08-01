# 開発ガイド

## 環境構築

### 必要要件
- Docker & Docker Compose
- Node.js 20+ (ローカル開発用)

### 初期セットアップ

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd trade-viewer
```

2. **環境変数の設定**
```bash
# バックエンド
cd backend
cp .env.example .env
# .envファイルを編集してAPIキーを設定

# フロントエンド
cd ../frontend
cp .env.example .env
# 必要に応じて設定を変更
```

3. **依存関係のインストール**
```bash
# バックエンド
cd backend
npm install

# フロントエンド
cd ../frontend
npm install
```

4. **Docker環境の起動（バックエンドのみ）**
```bash
cd docker
docker compose up -d
```

これによりRedisサービスが起動します。

5. **フロントエンドの起動**
```bash
cd frontend
npm run dev
```

## 開発コマンド

### Docker操作
```bash
cd docker

# 起動（開発環境）
docker compose up -d

# 停止
docker compose down

# ログ確認
docker compose logs -f

# 再起動
docker compose restart

# Redis再起動
docker compose restart redis

# コンテナとボリュームを削除
docker compose down -v
```

### バックエンド開発
```bash
cd backend

# 開発サーバー起動（ホットリロード）
npm run dev

# TypeScriptコンパイル
npm run build

# テスト実行
npm test

# Linting
npm run lint
```

### フロントエンド開発
```bash
cd frontend

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# Linting
npm run lint
```

## ディレクトリ構造

```
trade-viewer/
├── docker/
│   ├── docker-compose.yml    # Docker Compose設定
│   └── .env.example          # 環境変数サンプル
├── backend/
│   ├── src/
│   │   ├── index.ts         # エントリーポイント
│   │   ├── server.ts        # Fastifyサーバー設定
│   │   ├── routes/          # APIルート定義
│   │   ├── services/        # ビジネスロジック
│   │   ├── workers/         # 定期実行タスク
│   │   └── types/           # TypeScript型定義
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx         # エントリーポイント
│   │   ├── App.tsx          # ルートコンポーネント
│   │   ├── components/      # Reactコンポーネント
│   │   ├── hooks/           # カスタムフック
│   │   └── services/        # API通信
│   ├── package.json
│   └── vite.config.ts
└── docs/                     # ドキュメント
```

## コーディング規約

### TypeScript
- strictモードを有効化
- 明示的な型定義を推奨
- anyの使用は避ける

### 命名規則
- ファイル名: kebab-case
- 変数・関数: camelCase
- クラス・型: PascalCase
- 定数: UPPER_SNAKE_CASE

### Git コミット
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・補助ツール変更
```

## トラブルシューティング

### Docker関連
**Q: コンテナが起動しない**
```bash
cd docker

# ログを確認
docker compose logs -f

# クリーンアップして再起動
docker compose down -v
docker compose build
docker compose up -d
```

### API関連
**Q: 外部APIからデータが取得できない**
- APIキーが正しく設定されているか確認
- レート制限に達していないか確認
- backend/.envファイルの設定を確認

### Redis関連
**Q: キャッシュが更新されない**
```bash
# Redisに接続して確認
docker compose exec redis redis-cli
> KEYS *
> GET market:NKY
```