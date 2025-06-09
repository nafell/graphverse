import BranchView from "@/components/branch/BranchView";
import GraphView from "@/components/graph/GraphView";

export default function Home() {
  return (
    <main className="flex h-screen">
      <div className="flex-grow h-full">
        <GraphView />
      </div>
      <div className="w-1/3 h-full border-l">
        <BranchView />
      </div>
    </main>
  );
}
