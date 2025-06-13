import { create } from 'zustand';
import { ChatNode, ChatEdge, ChatSession, ContextState, UIState, MergeState } from '@/types';
import { addEdge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange } from 'reactflow';

export type GraphState = {
  // データ管理
  currentSession: ChatSession;
  sessions: ChatSession[];
  contextState: ContextState;
  uiState: UIState;
  mergeState: MergeState;
  
  // React Flow関連
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  
  // ノード・エッジ操作
  addNode: (node: ChatNode) => void;
  addEdge: (edge: ChatEdge) => void;
  updateNode: (nodeId: string, updates: Partial<ChatNode['data']>) => void;
  
  // コンテキスト管理
  selectContext: (nodeIds: string[]) => void;
  clearContext: () => void;
  validateContext: (additionalText?: string) => Promise<boolean>;
  
  // セッション管理
  createNewSession: (title: string) => void;
  switchSession: (sessionId: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  
  // UI操作
  setCurrentView: (view: UIState['currentView']) => void;
  toggleMergeMode: () => void;
  
  // Merge操作
  addToMergeSelection: (node: ChatNode) => void;
  removeFromMergeSelection: (nodeId: string) => void;
  clearMergeSelection: () => void;
  executeMerge: (prompt: string) => Promise<void>;
};

// 初期サンプルデータ
const createInitialSession = (): ChatSession => ({
  id: 'session-1',
  title: 'サンプルセッション',
  createdAt: new Date(),
  updatedAt: new Date(),
  nodes: [
    {
      id: 'node-1',
      type: 'chat',
      position: { x: 100, y: 100 },
      data: {
        label: '最初のノード',
        author: 'user',
        fullText: 'これが最初のノードです。',
        timestamp: new Date(),
        isSelectedAsContext: false,
        tokenCount: 15,
        topics: ['サンプル'],
        branchInfo: {
          parentNodeIds: [],
          branchType: 'new_topic'
        }
      },
    },
    {
      id: 'node-2',
      type: 'chat',
      position: { x: 300, y: 150 },
      data: {
        label: '2番目のノード',
        author: 'llm',
        fullText: 'これが2番目のノードです。',
        timestamp: new Date(),
        isSelectedAsContext: false,
        tokenCount: 20,
        topics: ['サンプル'],
        branchInfo: {
          parentNodeIds: ['node-1'],
          branchType: 'single'
        }
      },
    },
  ],
  edges: [
    {
      id: 'edge-1-2',
      source: 'node-1',
      target: 'node-2',
    },
  ],
});

const useGraphStore = create<GraphState>((set, get) => {
  const initialSession = createInitialSession();
  
  return {
  // 初期状態
  currentSession: initialSession,
  sessions: [initialSession],
  contextState: {
    selectedNodeIds: [],
    estimatedTokenCount: 0,
    maxTokenLimit: 128000,
    canAddMore: true,
    nodeTokenCounts: {},
  },
  uiState: {
    currentView: 'graph',
    isCreatingNewTopic: false,
  },
  mergeState: {
    isActive: false,
    selectedNodes: [],
    previewPrompt: '',
  },
  // React Flow関連
  onNodesChange: (changes) => {
    const currentSession = get().currentSession;
    const updatedNodes = applyNodeChanges(changes, currentSession.nodes) as ChatNode[];
    set({
      currentSession: {
        ...currentSession,
        nodes: updatedNodes,
        updatedAt: new Date(),
      }
    });
  },
  onEdgesChange: (changes) => {
    const currentSession = get().currentSession;
    const updatedEdges = applyEdgeChanges(changes, currentSession.edges) as ChatEdge[];
    set({
      currentSession: {
        ...currentSession,
        edges: updatedEdges,
        updatedAt: new Date(),
      }
    });
  },
  
  // ノード・エッジ操作
  addNode: (node) => {
    const currentSession = get().currentSession;
    set({
      currentSession: {
        ...currentSession,
        nodes: [...currentSession.nodes, node],
        updatedAt: new Date(),
      }
    });
  },
  addEdge: (edge) => {
    const currentSession = get().currentSession;
    set({
      currentSession: {
        ...currentSession,
        edges: addEdge(edge, currentSession.edges),
        updatedAt: new Date(),
      }
    });
  },
  updateNode: (nodeId, updates) => {
    const currentSession = get().currentSession;
    const updatedNodes = currentSession.nodes.map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, ...updates } } : node
    );
    set({
      currentSession: {
        ...currentSession,
        nodes: updatedNodes,
        updatedAt: new Date(),
      }
    });
  },
  
  // コンテキスト管理
  selectContext: (nodeIds) => {
    const { currentSession } = get();
    const selectedNodes = currentSession.nodes.filter(node => nodeIds.includes(node.id));
    const totalTokens = selectedNodes.reduce((sum, node) => sum + node.data.tokenCount, 0);
    const nodeTokenCounts = selectedNodes.reduce((acc, node) => {
      acc[node.id] = node.data.tokenCount;
      return acc;
    }, {} as Record<string, number>);
    
    set({
      contextState: {
        selectedNodeIds: nodeIds,
        estimatedTokenCount: totalTokens,
        maxTokenLimit: 128000,
        canAddMore: totalTokens < 120000, // バッファを残す
        nodeTokenCounts,
      }
    });
  },
  clearContext: () => {
    set({
      contextState: {
        selectedNodeIds: [],
        estimatedTokenCount: 0,
        maxTokenLimit: 128000,
        canAddMore: true,
        nodeTokenCounts: {},
      }
    });
  },
  validateContext: async () => {
    // TODO: API呼び出しで実際のトークン数を検証
    return get().contextState.canAddMore;
  },
  
  // セッション管理
  createNewSession: (title) => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [],
      edges: [],
    };
    
    set({
      currentSession: newSession,
      sessions: [...get().sessions, newSession],
    });
  },
  switchSession: (sessionId) => {
    const session = get().sessions.find(s => s.id === sessionId);
    if (session) {
      set({ currentSession: session });
      get().clearContext();
    }
  },
  updateSessionTitle: (sessionId, title) => {
    const sessions = get().sessions.map(session => 
      session.id === sessionId ? { ...session, title, updatedAt: new Date() } : session
    );
    set({ sessions });
    
    if (get().currentSession.id === sessionId) {
      set({
        currentSession: { ...get().currentSession, title, updatedAt: new Date() }
      });
    }
  },
  
  // UI操作
  setCurrentView: (view) => {
    set({
      uiState: { ...get().uiState, currentView: view }
    });
  },
  toggleMergeMode: () => {
    const { mergeState, uiState } = get();
    set({
      mergeState: { ...mergeState, isActive: !mergeState.isActive },
      uiState: { ...uiState, currentView: mergeState.isActive ? 'graph' : 'merge' }
    });
  },
  
  // Merge操作
  addToMergeSelection: (node) => {
    const { mergeState } = get();
    if (!mergeState.selectedNodes.find(n => n.id === node.id)) {
      set({
        mergeState: {
          ...mergeState,
          selectedNodes: [...mergeState.selectedNodes, node]
        }
      });
    }
  },
  removeFromMergeSelection: (nodeId) => {
    const { mergeState } = get();
    set({
      mergeState: {
        ...mergeState,
        selectedNodes: mergeState.selectedNodes.filter(n => n.id !== nodeId)
      }
    });
  },
  clearMergeSelection: () => {
    set({
      mergeState: {
        isActive: false,
        selectedNodes: [],
        previewPrompt: '',
      }
    });
  },
  executeMerge: async (prompt) => {
    // TODO: 実際のMerge処理をAPI呼び出しで実装
    console.log('Executing merge with prompt:', prompt);
    get().clearMergeSelection();
  },
};
});

export default useGraphStore; 