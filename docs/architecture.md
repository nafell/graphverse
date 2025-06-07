# GraphVerse アーキテクチャ設計書

## 1. 概要

本ドキュメントは、"GraphVerse"アプリケーションの技術アーキテクチャを定義するものです。

### 1.1. コンセプト

GraphVerseは、LLMとの対話をマインドマップのように視覚的に拡張していくWebアプリケーションです。従来の直線的なチャットUIとは異なり、ユーザーは対話の文脈（コンテキスト）を自由に選択し、思考の分岐や結合をグラフ構造として表現できます。これにより、より複雑で多角的な議論やアイデア創出を支援します。

### 1.2. 主要機能

-   **GraphView**:
    -   ユーザーとLLMの対話履歴全体をグラフとして可視化します。
    -   各対話は「ノード」としてカードUIで要約表示されます。
    -   対話間の関連性は「エッジ」として線で結ばれ、思考の流れを一望できます。
-   **BranchView**:
    -   現在フォーカスしている一連の対話（ブランチ）の詳細を表示します。
    -   新しい対話を入力するインターフェースを提供します。
    -   GraphViewから任意のノードを次の対話のコンテキストとして選択できます。

## 2. 技術スタック

本プロジェクトでは、モダンなWeb開発で広く採用され、生産性と開発者体験のバランスが取れた以下の技術を選定しました。

-   **フレームワーク**: Next.js (App Router)
-   **言語**: TypeScript
-   **UIライブラリ**: React
-   **ランタイム / パッケージマネージャ**: bun
-   **CSS**: Tailwind CSS
-   **リンター**: ESLint

## 3. ディレクトリ構成

Next.jsのApp Routerの規約に沿った、メンテナンス性と拡張性の高いディレクトリ構成を採用します。

```
.
├── .next/         # Next.jsのビルド成果物
├── node_modules/  # 依存パッケージ
├── public/        # 静的ファイル (画像など)
├── src/
│   ├── app/             # App Routerのルートディレクトリ
│   │   ├── api/         # API Routes (バックエンドロジック)
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx   # ルートレイアウト
│   │   └── page.tsx     # メインページ
│   ├── components/      # 再利用可能なUIコンポーネント
│   │   ├── ui/          # Shadcn/uiなどの汎用UIキット
│   │   ├── graph/       # GraphView関連コンポーネント
│   │   │   ├── GraphView.tsx
│   │   │   └── ChatCard.tsx
│   │   └── branch/      # BranchView関連コンポーネント
│   │       ├── BranchView.tsx
│   │       └── ChatInput.tsx
│   ├── hooks/           # カスタムフック
│   │   └── useGraphStore.ts
│   ├── lib/             # ユーティリティ、ヘルパー関数
│   │   └── utils.ts
│   ├── store/           # 状態管理 (Zustand)
│   │   └── index.ts
│   └── types/           # 型定義
│       └── index.ts
├── .eslintrc.json
├── bun.lockb
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 4. コンポーネントアーキテクチャ

コンポーネントは機能ごとに分割し、関心の分離を図ります。主要なコンポーネントとその関係性は以下の通りです。

```mermaid
graph TD
    A[src/app/layout.tsx] --> B(src/app/page.tsx)

    subgraph page.tsx
        C[GraphView]
        D[BranchView]
    end

    B --> C
    B --> D

    subgraph GraphView
        E[ReactFlowProvider] --> F{Graph Nodes & Edges}
        F -- renders --> G[ChatCard]
    end

    subgraph BranchView
        H[ChatHistory]
        I[ChatInput]
    end

    D --> H
    D --> I

    subgraph State Management
        J[(Global State: Zustand)]
    end

    J -- "グラフデータ提供" --> C
    J -- "カレントブランチ情報提供" --> D
    I -- "グラフ更新" --> J
    C -- "コンテキスト選択" --> I
```

-   **`page.tsx`**: アプリケーションのメインページ。`GraphView`と`BranchView`をレイアウトします。
-   **`GraphView.tsx`**: グラフ全体を描画するコンテナコンポーネント。グラフ操作（ズーム、パン）のロジックも担当します。
-   **`ChatCard.tsx`**: `GraphView`内の個々のノード（チャット要約）を表すコンポーネント。
-   **`BranchView.tsx`**: 現在のブランチのチャット履歴と入力フォームを持つコンテナコンポーネント。
-   **`ChatInput.tsx`**: テキスト入力、送信、コンテキスト選択のUIとロジックを担当します。

## 5. 状態管理

アプリケーションの状態は、その性質に応じてクライアント状態とサーバー状態に分類して管理します。

-   **クライアント状態**:
    -   グラフの構造（ノード、エッジ）、UIの状態（選択中のノードなど）は、アプリケーション全体で共有されるため、グローバルな状態管理が必要です。
    -   **採用ライブラリ**: **Zustand**
    -   **理由**: Context APIに比べてボイラープレートが少なく、シンプルで直感的なAPIを提供します。パフォーマンスにも優れています。

-   **サーバー状態 (キャッシュ管理)**:
    -   サーバーとのデータ通信（APIからのグラフデータ取得など）は、キャッシュ、再検証、楽観的更新といった高度な制御が必要です。
    -   **採用ライブラリ**: **SWR** または **React Query (@tanstack/react-query)**
    -   **理由**: データフェッチングに関する複雑なロジックをカプセル化し、宣言的に記述できます。Next.jsとの親和性も高いです。

## 6. データモデル

TypeScriptを用いてデータの型安全性を確保します。主要なデータモデルは以下の通りです。

```typescript:src/types/index.ts
// グラフのノード (各チャットを表す)
export interface ChatNode {
  id: string; // 一意なID (例: 'node-1')
  type: 'chat'; // ノードの種類 (react-flowで使用)
  position: { x: number; y: number }; // GraphView上の座標
  data: {
    label: string; // ChatCardに表示する要約テキスト
    author: 'user' | 'llm';
    fullText: string; // チャットの全文
    timestamp: Date;
    isSelectedAsContext: boolean; // コンテキストとして選択されているか
  };
}

// グラフのエッジ (ノード間の接続を表す)
export interface ChatEdge {
  id: string; // 一意なID (例: 'edge-1-2')
  source: string; // 接続元ノードのID
  target: string; // 接続先ノードのID
  // 必要に応じて重みなどのプロパティを追加
  // weight?: number;
}

// グラフ全体の状態
export interface GraphState {
  nodes: ChatNode[];
  edges: ChatEdge[];
  // アクションを定義
  addNode: (node: ChatNode) => void;
  // ...その他のアクション
}
```

## 7. API設計

Next.jsのAPI Routesを用いて、バックエンドAPIを構築します。

-   **エンドポイント**: `POST /api/chat`
-   **リクエストボディ**:
    ```json
    {
      "prompt": "新しいプロンプトのテキスト",
      "contextNodeIds": ["node-1", "node-3"]
    }
    ```
-   **レスポンス (ストリーミング)**:
    -   LLMからの応答をリアルタイムにクライアントに送信するため、ストリーミング形式を採用します。
    -   成功時: 新しく生成された`ChatNode`と、それにつながる`ChatEdge`の情報を返します。
    -   失敗時: エラー情報を返します。
-   **役割**:
    -   選択されたコンテキストノードの情報を取得します。
    -   プロンプトとコンテキストを整形し、LLM APIに送信します。
    -   LLMからの応答を受け取り、クライアントにストリーミングします。
    -   応答が完了したら、新しいノードとエッジの情報をデータベースに保存します。

## 8. ライブラリ選定

主要機能を実現するためのライブラリを選定します。

-   **グラフ描画**: **React Flow** (`reactflow`)
    -   **理由**: 高機能でカスタマイズ性が高く、ノードベースのUI構築に特化しています。インタラクティブなグラフを効率的に実装でき、ドキュメントも豊富です。
-   **UIコンポーネント**: **Shadcn/ui**
    -   **理由**: アクセシビリティが考慮された高品質なコンポーネントを、コピー＆ペーストでプロジェクトに導入できます。Tailwind CSSベースであるため、デザインの統一性とカスタマイズの容易さを両立できます。

## 9. 開発フロー

-   **セットアップ**: `bun install`
-   **開発サーバー起動**: `bun dev`
-   **ビルド**: `bun build`
-   **コード品質**: `bun run lint` を実行し、ESLintによる静的解析を行います。Prettierとの連携も設定し、コードフォーマットを自動化します。 