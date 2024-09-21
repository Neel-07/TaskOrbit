import KanbanBoard from "@/app/Kanban/KanbanBoard";

export default function KanbanPage() {
  return (
    <div className="container mx-auto p-4 rounded-lg h-screen p-8 bg-[#212121] border-2 border-[#f9f9f914]">
      <h1 className="text-4xl ml-4 font-bold mb-4 relative">
        <span className="border-b-4 border-green-500 rounded absolute left-0 top-[3rem] w-[5%]"></span>
        Kanban Board
      </h1>
      <KanbanBoard />
    </div>
  );
}
