import React from 'react';

const BranchView = () => {
  return (
    <div className="flex flex-col h-full">
      {/* コンテキスト管理セクション */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          選択中のコンテキスト
        </h3>
        <div className="text-xs text-gray-500">
          {/* TODO: ContextManager コンポーネント */}
          コンテキストが選択されていません
        </div>
      </div>
      
      {/* チャット履歴セクション */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          チャット履歴
        </h3>
        <div className="space-y-3">
          {/* TODO: ChatHistory コンポーネント */}
          <div className="text-sm text-gray-500">
            履歴がありません
          </div>
        </div>
      </div>
      
      {/* 入力セクション */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-3">
          {/* TODO: ChatInput コンポーネント */}
          <div className="text-sm text-gray-500">
            メッセージ入力フォームが表示されます
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchView; 