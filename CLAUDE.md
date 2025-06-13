# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

- `bun dev` - 開発サーバーを起動（Turbopack使用）
- `bun build` - プロダクションビルドを実行
- `bun run lint` - ESLintでコード品質チェック
- `bun start` - プロダクションサーバーを起動

## プロジェクト概要

GraphVerseは、LLMとの対話をマインドマップのように視覚的に拡張するWebアプリケーションです。従来の直線的なチャットUIとは異なり、ユーザーは対話の文脈を自由に選択し、思考の分岐や結合をグラフ構造として表現できます。

## アーキテクチャ

### 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **パッケージマネージャ**: bun
- **状態管理**: Zustand
- **グラフ描画**: React Flow
- **UI**: Tailwind CSS + Shadcn/ui
- **AI**: Vercel AI SDK + Google Generative AI

### 主要コンポーネント
- **GraphView** (`src/components/graph/GraphView.tsx`): 全体のグラフ構造を可視化
- **BranchView** (`src/components/branch/BranchView.tsx`): 現在のブランチの詳細表示と新しい対話の入力
- **ChatNode/ChatCard**: グラフ内の各対話ノードを表現

### 状態管理
- **Zustand store** (`src/store/graphStore.ts`): グラフの構造（ノード・エッジ）とReact Flowの状態管理
- 初期状態にはサンプルノードが含まれています

### 型定義
- **ChatNode**: React FlowのNodeを拡張し、`ChatNodeData`を含む
- **ChatNodeData**: ラベル、作成者、本文、タイムスタンプ、コンテキスト選択状態を管理
- **ChatEdge**: React FlowのEdgeをそのまま使用

## 開発時の注意点

### AI APIの統合
- Google Generative AI (`@google/generative-ai`) とVercel AI SDK (`ai`) を使用
- API Routesは `src/app/api/chat/route.ts` に実装予定

### グラフ操作
- React Flowを使用してインタラクティブなグラフを実装
- ノードの追加・削除・移動はZustandストア経由で管理
- エッジの接続も同様にストア経由で管理

### 日本語での設計
- アーキテクチャドキュメント (`docs/architecture.md`) は日本語で記述
- UIラベルやサンプルデータも日本語を使用