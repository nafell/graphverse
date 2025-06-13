import { Node, Edge } from 'reactflow';

// チャットノードのデータ構造
export interface ChatNodeData {
  label: string;
  author: 'user' | 'llm';
  fullText: string;
  timestamp: Date;
  isSelectedAsContext: boolean;
  tokenCount: number; // コンテキスト制限管理用
  topics: string[]; // 将来の検索機能用
  branchInfo?: {
    parentNodeIds: string[]; // このノードの親ノード(コンテキスト元)
    branchType: 'single' | 'merge' | 'new_topic'; // 分岐の種類
  };
}

// React FlowのNode型を拡張してChatNodeを定義
export type ChatNode = Node<ChatNodeData, 'chat'>;

// React FlowのEdge型を拡張してChatEdgeを定義
export type ChatEdge = Edge;

// セッション管理
export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  nodes: ChatNode[];
  edges: ChatEdge[];
}

// コンテキスト管理
export interface ContextState {
  selectedNodeIds: string[];
  estimatedTokenCount: number;
  maxTokenLimit: number;
  canAddMore: boolean;
  nodeTokenCounts: Record<string, number>;
}

// UI状態管理
export interface UIState {
  currentView: 'graph' | 'branch' | 'merge';
  selectedNodeForBranch?: string;
  isCreatingNewTopic: boolean;
}

// Merge操作用の状態
export interface MergeState {
  isActive: boolean;
  selectedNodes: ChatNode[];
  previewPrompt: string;
}

// API関連の型定義
export interface ChatRequest {
  prompt: string;
  contextNodeIds: string[];
  sessionId: string;
  branchType: 'single' | 'merge' | 'new_topic';
}

export interface ChatResponse {
  node: ChatNode;
  edges: ChatEdge[];
  sessionUpdated: ChatSession;
}

export interface ContextValidationRequest {
  nodeIds: string[];
  additionalText: string;
}

export interface ContextValidationResponse {
  totalTokens: number;
  maxTokens: number;
  canAddMore: boolean;
  nodeTokenCounts: Record<string, number>;
}