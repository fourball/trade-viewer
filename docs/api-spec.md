# API仕様書

## 基本情報

- **ベースURL**: `http://localhost:3001/api/v1`
- **認証**: なし（将来的にAPI Key認証を検討）
- **レスポンス形式**: JSON
- **文字コード**: UTF-8

## エンドポイント

### 1. 全市場データ取得

```
GET /api/v1/market/all
```

**レスポンス例**:
```json
{
  "success": true,
  "data": [
    {
      "symbol": "NKY",
      "name": "日経平均",
      "price": 41069.82,
      "change": 415.12,
      "changePercent": 1.02,
      "previousClose": 40654.70,
      "high": 41151.25,
      "low": 40639.32,
      "timestamp": "2024-01-20T10:30:00.000Z",
      "currency": "JPY"
    },
    {
      "symbol": "BTCUSDT",
      "name": "ビットコイン",
      "price": 115189.21,
      "change": 2156.32,
      "changePercent": 1.91,
      "previousClose": 113032.89,
      "timestamp": "2024-01-20T10:30:00.000Z",
      "currency": "USD"
    }
  ],
  "lastUpdated": "2024-01-20T10:30:00.000Z"
}
```

### 2. 個別市場データ取得

```
GET /api/v1/market/:symbol
```

**パラメータ**:
- `symbol` (string, required): 取得したいシンボル

**レスポンス例**:
```json
{
  "success": true,
  "data": {
    "symbol": "NKY",
    "name": "日経平均",
    "price": 41069.82,
    "change": 415.12,
    "changePercent": 1.02,
    "previousClose": 40654.70,
    "high": 41151.25,
    "low": 40639.32,
    "timestamp": "2024-01-20T10:30:00.000Z",
    "currency": "JPY"
  }
}
```

### 3. ヘルスチェック

```
GET /api/health
```

**レスポンス例**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "services": {
    "redis": "connected",
    "dataFetch": "running"
  }
}
```

## WebSocket仕様

### 接続

```javascript
const ws = new WebSocket('ws://localhost:3001/ws');
```

### メッセージフォーマット

#### クライアント → サーバー

**購読開始**:
```json
{
  "type": "subscribe",
  "symbols": ["NKY", "BTCUSDT", "GOLD", "USDJPY"]
}
```

**購読解除**:
```json
{
  "type": "unsubscribe",
  "symbols": ["NKY"]
}
```

#### サーバー → クライアント

**初回データ**:
```json
{
  "type": "initial",
  "data": [
    {
      "symbol": "NKY",
      "name": "日経平均",
      "price": 41069.82,
      // ... 他のフィールド
    }
  ]
}
```

**更新通知**:
```json
{
  "type": "update",
  "data": {
    "symbol": "NKY",
    "price": 41075.00,
    "change": 420.30,
    "changePercent": 1.04,
    "timestamp": "2024-01-20T10:31:00.000Z"
  }
}
```

**エラー**:
```json
{
  "type": "error",
  "message": "Invalid symbol: XXX"
}
```

## エラーレスポンス

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_SYMBOL",
    "message": "指定されたシンボルは無効です"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "データが見つかりません"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "サーバーエラーが発生しました"
  }
}
```

## レート制限

- 1分間に60リクエストまで
- WebSocket接続は1クライアントあたり1接続まで
- 制限超過時は429 Too Many Requestsを返却