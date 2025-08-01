# タスク完了時のチェックリスト

## コード変更後に必ず実行すること

### 1. Lintの実行
```bash
# バックエンド
cd backend
npm run lint

# フロントエンド
cd frontend  
npm run lint
```

### 2. 型チェック（フロントエンド）
```bash
cd frontend
npm run type-check
```

### 3. テストの実行（バックエンド）
```bash
cd backend
npm test
```

### 4. ビルドの確認
```bash
# バックエンド
cd backend
npm run build

# フロントエンド
cd frontend
npm run build
```

### 5. 動作確認
- Docker環境でバックエンドが正常に起動するか
- フロントエンドが正常に表示されるか
- WebSocket接続が確立されるか
- データが正しく表示されるか

### 6. コミット前の確認
- 不要なデバッグログ（console.log等）が残っていないか
- .envファイルがコミットされていないか（.gitignoreで除外されているか）
- コミットメッセージは日本語で書かれているか
- AI生成を示す文言（Claude Code、🤖等）が含まれていないか

## 注意事項
- APIキーなどの機密情報は絶対にコミットしない
- エラーハンドリングが適切に実装されているか確認
- TypeScriptの型エラーがないか確認