import EnhancedTable from "@/components/MenuTable";
import Settings from "@/components/Settings";

export default function Home() {
  return (
    <main
      className="min-h-[calc(100vh-24px)] mt-6 w-full p-6 
      relative bg-[#191b30] flex justify-center items-center"
    >
      <div
        className="sm:w-[90vw] max-sm:h-[31.25rem] max-w-[75rem] w-[96vw] bg-[#0e0f1b] p-5 pt-10
          text-2xl text-center rounded-lg text-[#e6e6e6]"
      >
        <div className="flex w-full justify-center relative">
          <h1>MENU</h1>
          <div className="absolute right-0 top-0">
            <Settings />
          </div>
        </div>
        <EnhancedTable />
      </div>
    </main>
  );
}
