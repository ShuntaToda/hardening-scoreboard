# Hardening Scoreboard

Hardeningイベント用の得点管理システム

## 機能

- チーム別の得点管理
- ウェブサイトのヘルスチェックによる自動得点付与
- 外部APIからの得点追加/減点
- リアルタイムスコア更新（WebSocket）
- 管理画面でのチーム・ウェブサイト管理

## 技術スタック

- **バックエンド**: Node.js + TypeScript + Hono + Prisma
- **フロントエンド**: Angular 20
- **データベース**: PostgreSQL
- **アーキテクチャ**: Clean Architecture
- **品質管理**: ESLint + Prettier
- **コンテナ**: Docker + Docker Compose

## セットアップ

### 開発環境

1. バックエンドのセットアップ
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

2. データベースの起動
```bash
docker-compose up postgres
```

3. フロントエンドのセットアップ
```bash
cd frontend
npm install
npm start
```

### 本番環境（Docker）

```bash
docker-compose up -d
```

アプリケーションは以下のポートで起動します：
- フロントエンド: http://localhost
- バックエンドAPI: http://localhost:3000
- PostgreSQL: localhost:5432

## API エンドポイント

### 認証なしエンドポイント
- `GET /api/teams` - チーム一覧とスコア
- `GET /api/scores/leaderboard` - リーダーボード
- `WebSocket /ws` - リアルタイム更新

### 認証必須エンドポイント（APIキー）
- `POST /api/scores` - 得点追加/減点

APIキーは管理画面から発行できます。リクエストヘッダーに `X-API-Key` として設定してください。

## 管理画面

http://localhost/admin でアクセス可能

- チームの追加/削除
- ウェブサイトの追加/削除
- APIキーの発行/削除

## ヘルスチェック設定

- チェック間隔: 1分（60秒）
- タイムアウト: 2秒
- 並行実行数: 5
- 成功時得点: 10点

## 開発

### コード品質管理

```bash
# Lint実行
npm run lint

# Lint修正
npm run lint:fix

# 型チェック
npm run typecheck
```

### データベース

```bash
# Prismaスキーマ変更後
npx prisma generate

# データベース更新
npx prisma db push

# マイグレーション作成
npx prisma migrate dev

# Prisma Studio（DB管理画面）
npx prisma studio
```