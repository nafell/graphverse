'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { ChatNodeData } from '@/types';
import { User, Bot, Clock } from 'lucide-react';

const ChatCard: React.FC<NodeProps<ChatNodeData>> = ({ data, selected }) => {
  const { label, author, timestamp, tokenCount, isSelectedAsContext } = data;
  
  const isUser = author === 'user';
  
  return (
    <Card 
      className={`
        min-w-[200px] max-w-[300px] 
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${isSelectedAsContext ? 'ring-2 ring-green-500 bg-green-50' : ''}
        ${isUser ? 'border-blue-200' : 'border-purple-200'}
        hover:shadow-md transition-shadow cursor-pointer
      `}
    >
      <CardContent className="p-3">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            {isUser ? (
              <User className="w-4 h-4 text-blue-600" />
            ) : (
              <Bot className="w-4 h-4 text-purple-600" />
            )}
            <span className={`text-xs font-medium ${
              isUser ? 'text-blue-600' : 'text-purple-600'
            }`}>
              {isUser ? 'ユーザー' : 'AI'}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{new Date(timestamp).toLocaleTimeString('ja-JP', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        </div>
        
        {/* メインコンテンツ */}
        <div className="text-sm text-gray-800 mb-2 overflow-hidden" 
             style={{
               display: '-webkit-box',
               WebkitLineClamp: 3,
               WebkitBoxOrient: 'vertical'
             }}>
          {label}
        </div>
        
        {/* フッター */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{tokenCount} tokens</span>
          {isSelectedAsContext && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              コンテキスト
            </span>
          )}
        </div>
      </CardContent>
      
      {/* React Flow ハンドル */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3"
      />
    </Card>
  );
};

export default ChatCard;