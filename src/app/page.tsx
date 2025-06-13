import BranchView from "@/components/branch/BranchView";
import GraphView from "@/components/graph/GraphView";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex flex-1 overflow-hidden">
        {/* GraphView - 60% */}
        <div className="flex-1 min-w-0 lg:w-3/5 h-full">
          <GraphView />
        </div>
        
        {/* BranchView - 40% */}
        <div className="w-full lg:w-2/5 h-full border-l border-gray-200 bg-white 
                        flex flex-col max-lg:hidden">
          <BranchView />
        </div>
      </main>
      
      {/* モバイル用のBranchView（将来実装） */}
      <div className="lg:hidden">
        {/* TODO: モバイル用タブ切り替えUI */}
      </div>
    </div>
  );
}
