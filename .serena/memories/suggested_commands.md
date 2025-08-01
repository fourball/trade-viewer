# 推奨コマンド一覧

## 開発環境の起動
```bash
# 1. バックエンド（Docker）の起動
cd docker
docker compose up -d

# 2. フロントエンドの起動
cd frontend
npm run dev
```

## バックエンド開発
```bash
cd backend

# 開発サーバー起動（ホットリロード）
npm run dev

# ビルド
npm run build

# Linting
npm run lint

# テスト実行
npm test

# 本番用起動
npm start
```

## フロントエンド開発
```bash
cd frontend

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# Linting
npm run lint

# 型チェック
npm run type-check

# プレビュー
npm run preview
```

## Docker操作
```bash
cd docker

# 起動
docker compose up -d

# 停止
docker compose down

# ログ確認
docker compose logs -f

# 特定サービスのログ
docker compose logs -f api
docker compose logs -f redis

# 再起動
docker compose restart

# 全削除（データも消える）
docker compose down -v
```

## Git操作
```bash
# ステータス確認
git status

# 変更の追加とコミット
git add .
git commit -m "コミットメッセージ（日本語）"

# プッシュ
git push origin main
```

## システムコマンド（macOS）
```bash
# 日時の取得（macOSのバグ対策）
LANG=en_US date

# ポート使用状況確認
lsof -i :3001  # バックエンド
lsof -i :5173  # フロントエンド

# プロセス確認
ps aux | grep node
```

## 環境変数設定
```bash
# バックエンド
cd backend
cp .env.example .env
# .envを編集

# フロントエンド  
cd frontend
cp .env.example .env
# 必要に応じて編集
```