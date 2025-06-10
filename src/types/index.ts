import { Node, Edge } from 'reactflow';

// architecture.md で定義された ChatNode の data プロパティ
export interface ChatNodeData {
  label: string;
  author: 'user' | 'llm';
  fullText: string;
  timestamp: Date;
  isSelectedAsContext: boolean;
}

// React FlowのNode型を拡張してChatNodeを定義
export type ChatNode = Node<ChatNodeData, 'chat'>;

// React FlowのEdge型を拡張してChatEdgeを定義 (architecture.md に追加プロパティはないため、Edgeをそのまま利用)
export type ChatEdge = Edge; 