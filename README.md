# Vistra Executive Producer

Vite + React + TypeScript プロジェクト

## 技術スタック

| カテゴリ | 採用技術 | 理由 |
|---------|---------|------|
| Build | Vite | 爆速ビルドツール |
| Framework | React (TypeScript) | |
| UI | MUI (Material UI) | Data Grid等の高機能部品で工数削減 |
| Routing | React Router | 定番・安定 |
| State/API | Connect-Query | 型安全な通信 |
| Test | Vitest | 環境だけ用意（基本は書かない） |
| Lint | ESLint + Prettier | |

## 開発

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動 (http://localhost:3000)
pnpm run dev

# ビルド
pnpm run build

# プレビュー
pnpm run preview
```

## コード品質

```bash
# Lint
pnpm run lint
pnpm run lint:fix

# フォーマット
pnpm run format
pnpm run format:check

# テスト
pnpm run test
pnpm run test:ui
```

## ディレクトリ構成

```
src/
├── components/     # 共通UIコンポーネント
├── features/       # 機能別ディレクトリ
├── hooks/          # カスタムフック
├── lib/            # ライブラリ設定
│   └── connect.ts  # Connect-Query クライアント
├── routes/         # ルーティング・ページ
├── test/           # テストセットアップ
├── theme/          # MUIテーマ
├── App.tsx
└── main.tsx
gen/                # Protocol Buffers 生成コード
```

## 環境変数

`.env` ファイルを作成して設定:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Connect RPC

バックエンドとの通信には Connect RPC を使用します。
Protocol Buffers から TypeScript コードを生成するには:

```bash
# buf.gen.yaml を設定後
npx buf generate
```
