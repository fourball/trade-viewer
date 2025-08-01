# データソース仕様書

## 必要なデータ

| データ種別 | シンボル | 説明 | 更新頻度 |
|-----------|---------|------|----------|
| 日経平均 | NKY | 日本の主要株価指数 | 1分 |
| ナスダック | NDX | 米国ハイテク株指数 | 1分 |
| ダウ平均 | DJI | 米国主要30社株価指数 | 1分 |
| ビットコイン | BTCUSDT | BTC/USD価格 | 1分 |
| ゴールド | GOLD | 金価格（USD/オンス） | 1分 |
| USD/JPY | USDJPY | ドル円為替レート | 1分 |
| 香港ハンセン | HSI | 香港株価指数 | 1分 |
| ナスダック先物 | NQ | ナスダック先物 | 1分 |
| ダウ先物 | YM | ダウ先物 | 1分 |

## 外部API選定

### 1. Yahoo Finance (yfinance)
**用途**: 株価指数、先物
```python
import yfinance as yf

# 日経平均
nikkei = yf.Ticker("^N225")
data = nikkei.info
```

**取得可能データ**:
- 現在価格
- 前日終値
- 変動額・率
- 高値・安値
- 出来高

### 2. CoinGecko API
**用途**: 暗号通貨価格
```javascript
// エンドポイント
GET https://api.coingecko.com/api/v3/simple/price
  ?ids=bitcoin
  &vs_currencies=usd
  &include_24hr_change=true
```

**レート制限**: 
- 無料: 30リクエスト/分
- 月間10,000リクエスト上限

### 3. Yahoo Finance API (為替用)
**用途**: 為替レート（リアルタイム）
```javascript
// サポートシンボル
USDJPY → JPY=X
```

**特徴**:
- リアルタイムデータ
- 制限なし（合理的な使用範囲内）

### 4. Alpha Vantage (バックアップ)
**用途**: 株価・為替の代替
```javascript
// エンドポイント
GET https://www.alphavantage.co/query
  ?function=GLOBAL_QUOTE
  &symbol=SPY
  &apikey=YOUR_API_KEY
```

**レート制限**:
- 無料: 5リクエスト/分
- 500リクエスト/日

## データ構造

### 統一レスポンス形式
```typescript
interface MarketData {
  symbol: string;           // "NKY", "BTCUSDT", etc.
  name: string;            // "日経平均", "ビットコイン", etc.
  price: number;           // 現在価格
  change: number;          // 変動額
  changePercent: number;   // 変動率(%)
  previousClose: number;   // 前日終値
  high: number;           // 高値
  low: number;            // 安値
  volume?: number;        // 出来高（オプション）
  timestamp: string;      // ISO 8601形式
  currency: string;       // "JPY", "USD", etc.
}
```

### Redisキー設計
```
market:NKY        → 日経平均データ
market:BTCUSDT    → ビットコインデータ
market:all        → 全データのキャッシュ
market:updated    → 最終更新時刻
```

## エラーハンドリング

### APIエラー時の処理
1. 3回までリトライ（指数バックオフ）
2. 失敗時は前回の値を使用
3. 5分以上古いデータは警告表示

### フォールバック戦略
- Yahoo Finance → Alpha Vantage
- CoinGecko → Binance API
- 為替: Yahoo Finance → Alpha Vantage