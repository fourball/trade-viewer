# APIキー取得ガイド

このアプリケーションは複数の外部APIを使用して市場データを取得します。
以下のガイドに従って必要なAPIキーを取得してください。

## 必須ではないが推奨されるAPIキー

開発時はモックデータで動作しますが、実際の市場データを取得するには以下のAPIキーが必要です。

### 1. Alpha Vantage API キー

**用途**: 株価、為替、商品（ゴールド）データの取得

#### 取得手順:
1. [Alpha Vantage](https://www.alphavantage.co/) にアクセス
2. 「GET YOUR FREE API KEY」をクリック
3. 必要事項を入力:
   - First Name（名前）
   - Last Name（姓）
   - Email（メールアドレス）
   - Organization（組織名、個人の場合は"Individual"）
4. 「GET FREE API KEY」をクリック
5. 表示されたAPIキーをコピー

**料金プラン**:
- 無料プラン: 5リクエスト/分、500リクエスト/日
- 有料プラン: より高いレート制限が必要な場合

### 2. Exchange Rate API キー（オプション）

**用途**: 為替レート（USD/JPY）の取得

#### 取得手順:
1. [Exchange Rate API](https://app.exchangerate-api.com/sign-up) にアクセス
2. アカウントを作成:
   - Email
   - Password
3. メールアドレスを確認
4. ダッシュボードからAPIキーを取得

**料金プラン**:
- 無料プラン: 1,500リクエスト/月
- 有料プラン: より多くのリクエストが必要な場合

## APIキーが不要なサービス

### 1. CoinGecko API

**用途**: 暗号通貨（ビットコイン）価格の取得

- 基本的な価格取得は**APIキー不要**
- レート制限: 30リクエスト/分（無料枠）
- より高いレート制限が必要な場合は[CoinGecko Pro](https://www.coingecko.com/en/api/pricing)を検討

### 2. Yahoo Finance

**用途**: 株価指数データの取得

- **APIキー不要**
- ただし、レート制限があるため本番環境では注意が必要
- 代替として有料のYahoo Finance APIサービスも存在

## 環境変数の設定

取得したAPIキーを環境変数に設定します：

### 1. Docker環境の場合
```bash
cd docker
cp -Rp env/.env.local .env
```

`.env`ファイルを編集:
```env
# Alpha Vantage API
ALPHA_VANTAGE_API_KEY=ここに取得したAPIキーを入力

# Exchange Rate API (オプション)
EXCHANGE_RATE_API_KEY=ここに取得したAPIキーを入力
```

### 2. ローカル開発の場合
```bash
cd backend
cp .env.example .env
```

同様に`.env`ファイルを編集してください。

## APIキーなしでの動作

APIキーを設定しない場合、アプリケーションは**モックプロバイダー**を使用して動作します。
これにより、実際のAPIを使用せずに開発・テストが可能です。

モックプロバイダーは以下の特徴があります：
- リアルな変動をシミュレート
- APIレート制限なし
- 開発・デモに最適

## トラブルシューティング

### APIキーが正しく認識されない場合

1. **環境変数の確認**
```bash
# Docker環境
docker-compose exec api env | grep API_KEY

# ローカル環境
echo $ALPHA_VANTAGE_API_KEY
```

2. **Dockerの再起動**
```bash
cd docker
docker compose down
docker compose up -d
```

3. **ログの確認**
```bash
cd docker
docker compose logs -f
```

### レート制限エラーが発生する場合

- Alpha Vantage: 1分あたり5リクエストの制限があるため、複数シンボルの取得には時間がかかります
- 本番環境では有料プランの検討、またはキャッシュ戦略の最適化を推奨

## セキュリティに関する注意

- APIキーを**絶対にGitにコミットしない**でください
- `.env`ファイルは`.gitignore`に含まれていることを確認
- 本番環境では環境変数として安全に管理してください