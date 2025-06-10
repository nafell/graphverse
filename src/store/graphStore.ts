import { create } from 'zustand';
import { ChatNode, ChatEdge } from '@/types';
import { addEdge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange } from 'reactflow';

export type GraphState = {
  nodes: ChatNode[];
  edges: ChatEdge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (node: ChatNode) => void;
  addEdge: (edge: ChatEdge) => void;
};

const useGraphStore = create<GraphState>((set, get) => ({
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
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as ChatNode[],
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as ChatEdge[],
    });
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  addEdge: (edge) => {
    set({
      edges: addEdge(edge, get().edges),
    });
  },
}));

export default useGraphStore; 