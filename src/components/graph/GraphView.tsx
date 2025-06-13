'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useGraphStore from '@/store/graphStore';
import ChatCard from './ChatCard';

const GraphView = () => {
  const { 
    currentSession, 
    onNodesChange, 
    onEdgesChange 
  } = useGraphStore();

  const { nodes, edges } = currentSession;

  // カスタムノードタイプの定義
  const nodeTypes = useMemo(() => ({
    chat: ChatCard,
  }), []);

  return (
    <div className="h-full bg-white relative">
      {/* グラフ操作ツールバー */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button className="px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm hover:bg-gray-50">
          Merge モード
        </button>
      </div>
      
      {/* React Flow */}
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default GraphView; 