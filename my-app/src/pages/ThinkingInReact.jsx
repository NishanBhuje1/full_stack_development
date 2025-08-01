import FilterableProductTable from "../components/FilterableProductTable";

export function ThinkingInReact() {
  return (
    <div className="flex justify-center items-center h-dvh bg-grey-200">
      <div className="w=[500px] bg-white shadow-xl rounddex-2xl p-8 flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Thinking in React.</h2>
        <FilterableProductTable />
      </div>
    </div>
  );
}
