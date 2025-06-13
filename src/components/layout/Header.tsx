'use client';

import React from 'react';
import useGraphStore from '@/store/graphStore';

const Header = () => {
  const { currentSession } = useGraphStore();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            GraphVerse
          </h1>
          <div className="text-sm text-gray-500">
            現在のセッション: {currentSession.title}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* TODO: セッション管理ボタンを追加 */}
          <div className="text-xs text-gray-400">
            {currentSession.nodes.length} ノード
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;